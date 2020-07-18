import React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import './App.css';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import { userSigninReducer } from './reducers/userReducers';
import RegisterScreen from './screens/RegisterScreen';


function App() {
    const userSignin = useSelector(state=>state.userSignin);
    const {userInfo} = userSignin;

  const openMenu = () =>{
    document.querySelector(".sidebar").classList.add("open");
  }
  const closeMenu = () => {
    document.querySelector(".sidebar").classList.remove("open");
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
                      <a href="cart.html">Cart</a>
                      
                      {userInfo ? (<Link to="/profile">{userInfo.name}</Link>) : (<Link to="/signin">Sign In</Link>)}
                  </div>
              </header>
              <aside className="sidebar">
                  <div className="sidebar-content">
                      <h3>Categories</h3>
                      <button className="sidebar-close-button" onClick={closeMenu}>x</button>
                      <u1>
                          <li>
                              <a href="index.html">Cashmere Lop</a>
                          </li>
                          <li>
                              <a href="index.html">American Fuzzy Lop</a>
                          </li>
                      </u1>
                  </div>
              </aside>
              <main className="main">
                  <div className="content">
                      {/* <Switch> */}
                      <Route path="/signin" component={SigninScreen} />
                      <Route path="/register" component={RegisterScreen} />
                      <Route path="/product/:id" component={ProductScreen} />
                      {/* ? means id is optional, path=/cart/ should also work */}
                      <Route path="/cart/:id?" component={CartScreen}/>
                      <Route path="/" exact={true} component={HomeScreen} />
                      {/* </Switch> */}

                  </div>

              </main>
              <footer className="footer">All right reserved.</footer> 
          </div>
        </BrowserRouter>
  );
}

export default App;
