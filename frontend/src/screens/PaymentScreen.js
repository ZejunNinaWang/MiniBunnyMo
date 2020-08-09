import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
            setPaymentMethod(payment.paymentMethod);
            document.getElementById('paymentMethod-paypal').checked = payment.paymentMethod === "paypal" ; 
        }       
        return () => {
        };
    }, []);

    const checkHandler = (e) => {
        setPaymentMethod(e.target.value);
    }
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod: paymentMethod }));
    props.history.push('/placeorder');
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