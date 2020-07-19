import Axios from "axios";
import Cookie from "js-cookie";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING, CART_SAVE_PAYMENT } from "../constants/cartConstants";

//getState is from thunk
const addToCart = (productId, qty) => async (dispatch, getState) => {
    try{
        const {data} = await Axios.get("/api/products/" + productId);
        dispatch({type: CART_ADD_ITEM , payload:{
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty: qty
            }
        });

        //after adding item to the cart by dispatching the above action
        //we can get access to the cartItems by:    
        const {cart:{cartItems}} = getState();
        //Save cartItems into the cookie
        Cookie.set("cartItems", JSON.stringify(cartItems));

    }
    catch(error)
    {

    }
}

const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({type: CART_REMOVE_ITEM, payload: productId});
    
    const {cart:{cartItems}} = getState();
    Cookie.set("cartItems", JSON.stringify(cartItems));
}

const saveShipping = (shippingData) => (dispatch, getState) => {
    dispatch({type: CART_SAVE_SHIPPING, payload: shippingData});
    const {cart:{shipping}} = getState();
    Cookie.set("shipping", JSON.stringify(shipping));
}

const savePayment = (paymentMethod) => (dispatch, getState) => {
    dispatch({type: CART_SAVE_PAYMENT, payload: paymentMethod});
    const {cart:{payment}} = getState();
    Cookie.set("payment", JSON.stringify(payment));
}
export {addToCart, removeFromCart, saveShipping, savePayment}