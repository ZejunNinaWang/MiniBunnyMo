import React, { useRef } from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import './App.css';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import { userSigninReducer } from './reducers/userReducers';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrdersScreen from './screens/OrdersScreen';


function App() {
    const sidebar = useRef();
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;
    console.log("App: userInfo is ", userInfo);

  const openMenu = () =>{
    document.querySelector(".sidebar").classList.add("open");
    document.addEventListener('click', handleClickOutside, true);
  }
  const closeMenu = () => {
    document.querySelector(".sidebar").classList.remove("open");
    document.removeEventListener('click', handleClickOutside, true);
  }

  //hide sidebar if mouse click outside of sidebar
  const handleClickOutside = (event) =>{
    if (sidebar.current && !sidebar.current.contains(event.target)) {
        closeMenu();
    }
  }
  return (
    <BrowserRouter>
      <div className="grid-container">
              <header className="header">
                  <div className="brand">
                      <button onClick={openMenu}>
                          &#9776;
                      </button>
                      <Link to="/">MiniBunnyMo</Link>
                      
                  </div>
                  <div className="header-links">
                      {/* <a href="cart.html">Cart</a> */}
                      <Link to="/cart">Cart</Link>
                      {userInfo ? (<Link to="/profile">{userInfo.name}</Link>) : (<Link to="/signin">Sign In</Link>)}
                      {userInfo && userInfo.isAdmin && (
                          <div className="dropdown">
                            <a href="#" >Admin</a>
                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/products">Products</Link>
                                    <Link to="/orders">Orders</Link>
                                </li>
                            </ul>
                          </div>
                      )}
                  </div>
              </header>
              <aside className="sidebar" ref={sidebar}>
                  <div className="sidebar-content">
                      <h3>Categories</h3>
                      <button className="sidebar-close-button" onClick={closeMenu}>x</button>
                      <u1 className="categories">
                          <li>
                              <Link to="/category/Cashmere Lop">Cashmere Lop</Link>
                          </li>
                          <li>
                              <Link to="/category/American Fuzzy Lop">American Fuzzy Lop</Link>
                          </li>
                      </u1>
                  </div>
              </aside>
              <main className="main">
                  <div className="content">
                      {/* <Switch> */}
                      <Route path="/profile" component={ProfileScreen} />
                      <Route path="/order/:id" component={OrderScreen} />
                      <Route path="/orders" component={OrdersScreen} />
                      <Route path="/placeorder" component={PlaceOrderScreen} />
                      <Route path="/payment" component={PaymentScreen} />
                      <Route path="/shipping" component={ShippingScreen} />
                      <Route path="/products" component={ProductsScreen} />
                      <Route path="/signin" component={SigninScreen} />
                      <Route path="/register" component={RegisterScreen} />
                      <Route path="/product/:id" component={ProductScreen} />
                      {/* ? means id is optional, path=/cart/ should also work */}
                      <Route path="/cart/:id?" component={CartScreen}/>
                      <Route path="/" exact={true} component={HomeScreen} />
                      <Route path="/category/:id" component={HomeScreen} />
                      {/* </Switch> */}

                  </div>

              </main>
              <footer className="footer">All right reserved.</footer> 
          </div>
        </BrowserRouter>
  );
}

export default App;
