import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { productListReducer, productDetailsReducer, productSaveReducer, productDeleteReducer, productReviewSaveReducer, myProductListReducer } from "./reducers/productReducers";
import thunk from 'redux-thunk';
import Cookie from "js-cookie";
import { cartReducer } from "./reducers/cartReducers";
import { userSigninReducer, userUpdateReducer, userAvatarSaveReducer, /*userRegisterReducer*/ } from "./reducers/userReducers";
import { OrderCreateReducer, orderCreateReducer, orderDetailsReducer, myOrderListReducer, orderListReducer, orderDeleteReducer } from "./reducers/orderReducers";
import { likesByProductIdReducer } from "./reducers/likeReducer";

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
    myProductList: myProductListReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userUpdate: userUpdateReducer,
    //userRegister: userRegisterReducer,
    userAvatarSave: userAvatarSaveReducer,
    productSave: productSaveReducer,
    productDelete: productDeleteReducer,
    productReviewSave: productReviewSaveReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    myOrderList: myOrderListReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    likes: likesByProductIdReducer //a dict
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));
export default store; 