import React, { useEffect, useState, useRef } from 'react';
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

    const passwordMatchRef = useRef(true);
    //if not exist, redirect to home page
    //else, redirect to page indicated after "=", such as shipping, signin
    const redirect = props.location.search? props.location.search.split("=")[1]:"/";

    useEffect(() => {
        // passwordMatchRef.current = true;
        if(userInfo && userInfo.name){
            if(redirect === "/"){
                window.location.href = "/avatar";
            }
            else{
                window.location.href = "/avatar?redirect="+redirect;
            }
            
        }
        return () => {

        };
    }, [userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        //check password match
        if(password !== rePassword){
            passwordMatchRef.current = false;
        }
        else{
            dispatch(register(name,email, password));
        }
        
        
    }

    const signin = () => {
        const redirectUrl = redirect==="/"?"signin":"signin?redirect="+redirect;
        props.history.push(redirectUrl);
    }

    return(
        <div>
            <RegisterSteps></RegisterSteps>
            <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Create Account</h2></li>
                    {/* {loading && <div style={{color:'green'}}>Loading</div>} */}
                    {loading && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
                    {error && <div>{error}</div>}
                    {password !== rePassword ? <div style={{color:'red'}}>Password not match</div> : <div></div>}
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
                        <label htmlFor="password">Re-Enter Password</label>
                        <input type="password" name="rePassword" id="rePassword" onChange={(e) => setRePassword(e.target.value)}></input>
                    </li>
                    <li>
                        <button 
                        type="submit" 
                        className="button"
                        >Register</button>
                    </li>
                    <li>Already have an account?</li>
                    <li className="register-li">
                        {/* <Link to={redirect==="/"?"signin":"signin?redirect="+redirect} className="button secondary register">Sign-in</Link> */}
                        <button 
                        className="button secondary register" 
                        onClick={signin}>
                        Sign-in
                        </button>
                    </li>
                </ul>
            </form>
           </div>
        </div>
    )
}

export default RegisterScreen;