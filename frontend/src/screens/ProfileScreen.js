import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, update } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

function ProfileScreen(props){
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const userUpdate = useSelector(state => state.userUpdate);
    const {loading, success, error} = userUpdate;

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;
    console.log("ProfileScreen: userInfo is ", userInfo);

    const myOrderList = useSelector(state => state.myOrderList);
    const {loading: loadingOrders, orders, error: errorOrders} = myOrderList;

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        props.history.push("/signin");
    }

    //update button handler
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(update({userId: userInfo._id, name, email, password}));
        window.location.reload();
    }

    useEffect(() => { 
        if (userInfo) {
            //console.log(userInfo.name)
            setEmail(userInfo.email);
            setName(userInfo.name);
            setPassword(userInfo.password);
          }

        dispatch(listMyOrders());
        return () => {

        };
    }, [userInfo]);

    return <div className="profile">
        <div className="profile-info">
        <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>User Profile</h2></li>
                    {loading && <div>Loading</div>}
                    {error && <div>{error}</div>}
                    {/*TODO: fix issue: the following text should disappear after switch screen,for now it only disappear when refresh page */}
                    {success && <div style={{color: "green"}}>Profile Saved Successfully.</div>}
                    <li>
                        <label htmlFor="name">Name</label>
                        <input type="name" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </li>
                    
                    <li>
                        <button type="submit" className="button">Update</button>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="button secondary full-width">Logout</button>
                    </li>
                    
                </ul>
            </form>
           </div>
        </div>
        <div className="profile-orders"></div>
    </div>
}

export default ProfileScreen;