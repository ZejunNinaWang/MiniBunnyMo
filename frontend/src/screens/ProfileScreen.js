import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, update } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

function ProfileScreen(props){
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const userUpdate = useSelector(state => state.userUpdate);
    const {loading, success: userUpdateSuccess , error} = userUpdate;

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

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
        console.log("name is ", name);
        dispatch(update({userId: userInfo._id, name, email, password}));
        // window.location.reload();
    }

    useEffect(() => { 
        if (userInfo) {
            setEmail(userInfo.email);
            setName(userInfo.name);
            setPassword(userInfo.password);
            
          }

        dispatch(listMyOrders());
        return () => {

        };
    }, [userSignin]);

    return <div className="profile">
        <div className="profile-info">
        <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>User Profile</h2></li>
                    {loading && <div>Loading</div>}
                    {error && <div style={{color: "green"}}>{error}</div>}
                    {/*TODO: fix issue: the following text should disappear after switch screen,for now it only disappear when refresh page */}
                    {userUpdateSuccess && <div style={{color: "green"}}>Profile Saved Successfully.</div>}
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
        <div className="profile-orders content-margined">
        {
            loadingOrders ? <div>Loading...</div> :
            errorOrders ? <div>{errorOrders} </div> :
            <div className="order-list">
                <table >
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? 'Paid':'Not Paid'}</td>
                    <td>
                        <Link to={"/order/" + order._id}>DETAILS</Link>
                    </td>
                    </tr>)}
                </tbody>
                </table>
                </div>
        }
        </div>
    </div>
}

export default ProfileScreen;