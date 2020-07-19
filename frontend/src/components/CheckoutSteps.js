import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CheckoutSteps(props) {
    const cart = useSelector(state => state.cart); //cart is set to the state defined from the cart reducer
    const {shipping, payment} = cart;

    const userSignin = useSelector(state => state.userSignin);
    const {loading, userInfo, error} = userSignin;

  return <div className="checkout-steps">
    <div className={props.step1 ? 'active' : ''}><Link disabled={userInfo} className={props.step1 ? 'active' : ''} to="signin?redirect=shipping">Signin</Link></div>
    <div className={props.step2 ? 'active' : ''}><Link className={props.step2 ? 'active' : ''} to="shipping">Shipping</Link></div>
    <div className={props.step3 ? 'active' : ''}><Link className={props.step3 ? 'active' : ''} to="payment">Payment</Link></div>
    <div className={props.step4 ? 'active' : ''}><Link className={props.step4 ? 'active' : ''} to="placeorder">Place Order</Link></div>
  </div>
}

export default CheckoutSteps;