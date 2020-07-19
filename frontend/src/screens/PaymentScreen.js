import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen(props) {

    const cart = useSelector(state => state.cart); //cart is set to the state defined from the cart reducer
    const {payment} = cart;

  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();

    useEffect(() => { 
        if(payment && payment.paymentMethod){
            // console.log("payment method is ", payment.paymentMethod);
            setPaymentMethod(payment.paymentMethod);
            // console.log("paymentMethod prop is ", paymentMethod);
            document.getElementById('paymentMethod-paypal').checked = payment.paymentMethod === "paypal" ;
            
        }
        
        // console.log("document.getElementById('paymentMethod-paypal').checked is ", document.getElementById('paymentMethod-paypal').checked);
        // console.log("", paymentMethod === payment.paymentMethod)
        
        return () => {
        };
    }, []);

    const checkHandler = (e) => {
        // console.log("in checkhandler");
        // console.log("target.checked is ", e.target.checked);
        // const checked = e.target.checked;
        // e.target.checked = !checked;
        setPaymentMethod(e.target.value);
    }
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log("in Submit handler");
    // console.log("paymentMethod is ", paymentMethod);
    dispatch(savePayment({ paymentMethod: paymentMethod }));
    props.history.push('placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Payment</h2>
            </li>

            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod-paypal"
                  value="paypal"
                //   onChange={(e) => setPaymentMethod(e.target.value)}
                    onChange={checkHandler}
                ></input>
                <label htmlFor="paymentMethod">Paypal</label>

                {/* <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="credit card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></input>
                <label for="paymentMethod">Credit Card</label> */}
              </div>
            </li>

            <li>
              <button type="submit" className="button primary">
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
export default PaymentScreen;