import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL, ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, MY_ORDER_LIST_REQUEST, MY_ORDER_LIST_SUCCESS, MY_ORDER_LIST_FAIL
} from "../constants/orderConstants";

const { default: Axios } = require("axios");

const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_CREATE_REQUEST, payload: order});

        const {userSignin: {userInfo}} = getState();
    
        const {data: {data: newOrder}} = await Axios.post("/api/orders", order, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token//???????
            }
        });

        dispatch({type: ORDER_CREATE_SUCCESS, payload: newOrder});
        
    } catch (error) {
        dispatch({type: ORDER_CREATE_FAIL, payload: error.message});
    }
}

const detailsOrder = (orderId) => async (dispatch, getState) => {
    try {
        dispatch({type: ORDER_DETAILS_REQUEST, payload: orderId});

        const {userSignin: {userInfo}} = getState();
    
        const {data} = await Axios.get("/api/orders/" + orderId, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token//???????
            }
        });

        dispatch({type: ORDER_DETAILS_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: ORDER_DETAILS_FAIL, payload: error.message});
    }
}

const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({type: MY_ORDER_LIST_REQUEST});

        const {userSignin: {userInfo}} = getState();
    
        const {data} = await Axios.get("/api/orders/mine", {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        });

        dispatch({type: MY_ORDER_LIST_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({type: MY_ORDER_LIST_FAIL, payload: error.message});
    }
}

export {createOrder, detailsOrder, listMyOrders};