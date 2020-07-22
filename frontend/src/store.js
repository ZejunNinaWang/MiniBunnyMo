import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { productListReducer, productDetailsReducer, productSaveReducer, productDeleteReducer } from "./reducers/productReducers";
import thunk from 'redux-thunk';
import Cookie from "js-cookie";
import { cartReducer } from "./reducers/cartReducers";
import { userSigninReducer, userUpdateReducer, /*userRegisterReducer*/ } from "./reducers/userReducers";
import { OrderCreateReducer, orderCreateReducer, orderDetailsReducer, myOrderListReducer, orderListReducer, orderDeleteReducer } from "./reducers/orderReducers";

const cartItems = Cookie.getJSON("cartItems") || [];
const userInfo = Cookie.getJSON("userInfo") || {};
const shipping = Cookie.getJSON("shipping") || {};
const payment = Cookie.getJSON("payment") || {};

const initialState = {
    cart:{cartItems: cartItems,
        shipping: shipping,
        payment: payment
    }, 
    userSignin: {userInfo: userInfo} //initial state for userSignin reducer
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userUpdate: userUpdateReducer,
    //userRegister: userRegisterReducer,
    productSave: productSaveReducer,
    productDelete: productDeleteReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    myOrderList: myOrderListReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store; 