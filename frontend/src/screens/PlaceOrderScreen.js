import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

function PlaceOrderScreen(props) {

  const [count, setCount] = useState(0);

  console.log('Enterted PlaceOrderScreen');

  const cart = useSelector(state => state.cart);
  const orderCreate = useSelector(state => state.orderCreate);

  //const orderCreate = useSelector(state => state.orderCreate);
  //const { loading, success, error, order } = orderCreate;

  const { cartItems, shipping, payment } = cart;
  const {loading, order, error, success} = orderCreate;
  console.log('success is ', success);
//   console.log("cartItems has ", cartItems.length);
//   console.log("shipping is ", shipping);
//   console.log("payment is ", payment);

  if (!shipping) {
    //   console.log("!shipping");
    props.history.push("shipping");
  } 
  if (shipping && !shipping.address) {
    // console.log("!shipping.address");
  props.history.push("shipping");
} 
  if (!payment) {
    // console.log("!payment");
    props.history.push("payment");
  }

  if (payment && !payment.paymentMethod) {
    // console.log("!payment.paymentMethod");
    props.history.push("payment");
  }
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    console.log('in placeOrderHandler');
    // create an order
    dispatch(createOrder({
      orderItems: cartItems, shipping, payment, itemsPrice, shippingPrice,
      taxPrice, totalPrice
    }));
  }
  useEffect(() => {
      //Ignore first render by using count
      if(count){
        //if order created success, redirect to order detail page
        if (success) {
          console.log("Order created successfully, ", order);
          props.history.push("/order/" + order._id);
        }
      }
      setCount(1);


  }, [success]);

  return ((shipping && payment) ?
    <div>
    <CheckoutSteps step1 step2 step3 step4 ></CheckoutSteps>
    <div className="placeorder">
      <div className="placeorder-info">
        <div>
          <h3>
            Shipping
          </h3>
          <div>
            {shipping.address}, {shipping.city},
            {shipping.postalCode}, {shipping.country}
          </div>
        </div>
        <div>
          <h3>Payment</h3>
          <div>
            Payment Method: {cart.payment.paymentMethod}
          </div>
        </div>
        <div>
          <ul className="cart-list-container">
            <li>
              <h3>
                Shopping Cart
          </h3>
              <div>
                Price
          </div>
            </li>
            {
              cartItems.length === 0 ?
                <div>
                  Cart is empty
          </div>
                :
                cartItems.map(item =>
                  <li>
                    <div className="cart-image">
                      {/* <img src={item.image} alt="product" /> */}
                      <img  src={"../api/image/"+item.image} alt="product"/>
                    </div>
                    <div className="cart-name">
                      <div>
                        <Link to={"/product/" + item.product}>
                          {item.name}
                        </Link>

                      </div>
                      <div>
                        Qty: {item.qty}
                      </div>
                    </div>
                    <div className="cart-price">
                      ${item.price}
                    </div>
                  </li>
                )
            }
          </ul>
        </div>
      </div>
      <div className="placeorder-action">
        <ul>
          <li>
            <button disabled={itemsPrice <= 0} className="button primary full-width" onClick={placeOrderHandler} >Place Order</button>
          </li>
          <li>
            <h3>Order Summary</h3>
          </li>
          <li>
            <div>Items</div>
            <div>${itemsPrice}</div>
          </li>
          <li>
            <div>Shipping</div>
            <div>${shippingPrice}</div>
          </li>
          <li>
            <div>Tax</div>
            <div>${taxPrice}</div>
          </li>
          <li>
            <h3>Order Total</h3>
            <h3>${totalPrice}</h3>
          </li>
        </ul>



      </div>

    </div>
  </div> :
  <div></div>
        
  )

}

export default PlaceOrderScreen;
