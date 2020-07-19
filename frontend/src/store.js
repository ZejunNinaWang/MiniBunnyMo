import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { productListReducer, productDetailsReducer, productSaveReducer, productDeleteReducer } from "./reducers/productReducers";
import thunk from 'redux-thunk';
import Cookie from "js-cookie";
import { cartReducer } from "./reducers/cartReducers";
import { userSigninReducer, /*userRegisterReducer*/ } from "./reducers/userReducers";

const cartItems = Cookie.getJSON("cartItems") || [];
const userInfo = Cookie.getJSON("userInfo") || null;
const shipping = Cookie.getJSON("shipping") || {};
const payment = Cookie.getJSON("payment") || {};

const initialState = {
    cart:{cartItems: cartItems,
        shipping: shipping,
        payment: payment
    }, 
    userSignin: {userInfo}
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    //userRegister: userRegisterReducer,
    productSave: productSaveReducer,
    productDelete: productDeleteReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store; 