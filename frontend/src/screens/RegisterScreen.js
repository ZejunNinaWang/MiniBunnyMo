import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';
import RegisterSteps from '../components/RegisterSteps';


function RegisterScreen(props){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const userRegister = useSelector(state => state.userSignin);
    const {loading, userInfo, error} = userRegister;
    const dispatch = useDispatch();

    //if not exist, redirect to home page
    //else, redirect to page indicated after "=", such as shipping, signin
    const redirect = props.location.search? props.location.search.split("=")[1]:"/";

    useEffect(() => {
        if(userInfo && userInfo.name){
            window.location.href = "/avatar";
        }
        return () => {

        };
    }, [userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(name,email, password));
    }

    return(
        <div>
            <RegisterSteps></RegisterSteps>
            <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Create Account</h2></li>
                    {loading && <div>Loading</div>}
                    {error && <div>{error}</div>}
                    <li>
                        <label htmlFor="name">Name</label>
                        <input type="name" name="name" id="name" onChange={(e) => setName(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="rePassword">Re-Enter Password</label>
                        <input type="Password" name="rePassword" id="rePassword" onChange={(e) => setRePassword(e.target.value)}></input>
                    </li>
                    <li>
                        <button type="submit" className="button">Register</button>
                    </li>
                    <li>Already have an account?</li>
                    <li>
                        <Link to={redirect==="/"?"signin":"signin?redirect="+redirect} className="button secondary">Sign-in</Link>
                    </li>
                </ul>
            </form>
           </div>
        </div>
    )
}

export default RegisterScreen;