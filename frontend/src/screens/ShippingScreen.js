import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';
import { saveShipping } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';


function ShippingScreen(props){

    const cart = useSelector(state => state.cart); //cart is set to the state defined from the cart reducer
    const {shipping} = cart;

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const dispatch = useDispatch();

    useEffect(() => { 
        if(shipping){
            if(shipping.address)
                setAddress(shipping.address);
            if(shipping.city)
                setCity(shipping.city);
            if(shipping.postalCode)
                setPostalCode(shipping.postalCode);
            if(shipping.country)
                setCountry(shipping.country);
        }

        //if save product success, close product form
        return () => {

        };
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShipping({ address, city, postalCode, country }));
        props.history.push("payment");
    }

    return(
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
        
            <div className='form'>
                <form onSubmit={submitHandler}>
                    <ul className="form-container">
                        <li><h2>Shipping</h2></li>
                        <li>
                            <label htmlFor="address">
                                Address
                            </label>
                            <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)}>
                            </input>
                        </li>
                        <li>
                            <label htmlFor="city">
                                City
                            </label>
                            <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                            </input>
                        </li>
                        <li>
                            <label htmlFor="postalCode">
                                Postal Code
                            </label>
                            <input type="text" name="postalCode" value={postalCode} id="postalCode" onChange={(e) => setPostalCode(e.target.value)}>
                            </input>
                        </li>
                        <li>
                            <label htmlFor="country">
                                Country
                            </label>
                            <input type="text" name="country" value={country} id="country" onChange={(e) => setCountry(e.target.value)}>
                            </input>
                        </li>
                        
                        <li>
                            <button type="submit" className="button primary">Continue</button>
                        </li>
                    </ul>
                </form>
            </div>

        </div>
    )
}

export default ShippingScreen;