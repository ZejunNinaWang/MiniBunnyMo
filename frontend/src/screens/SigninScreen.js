import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';


function SigninScreen(props){
    //const User = data.Users.find(x => x._id === props.match.params.id)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userSignin = useSelector(state => state.userSignin);
    const {loading, userInfo, error} = userSignin;
    const dispatch = useDispatch();

    //if not exist, redirect to home page
    //else, redirect to page indicated after "=", such as shipping
    const redirect = props.location.search? props.location.search.split("=")[1]:"/";

    useEffect(() => {
        //after signin, redirect 
        if(userInfo){
            props.history.push(redirect);
        }
        return () => {

        };
    }, [userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }

    return(<div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Sign-In</h2></li>
                    {loading && <div>Loading</div>}
                    {error && <div>{error}</div>}
                    <li>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}></input>
                    </li>
                    <li>
                        <button type="submit" className="button">Sign in</button>
                    </li>
                    <li>New to MiniBunnyMo?</li>
                    <li>
                        <Link to={redirect==="/"?"register":"register?redirect="+redirect} className="button secondary">Create your MiniBunnyMo account</Link>
                    </li>
                </ul>
            </form>
           </div>
    )
}

export default SigninScreen;