import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_SAVE_REQUEST, PRODUCT_SAVE_SUCCESS, PRODUCT_SAVE_FAIL, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL, PRODUCT_REVIEW_SAVE_REQUEST, PRODUCT_REVIEW_SAVE_SUCCESS, PRODUCT_REVIEW_SAVE_FAIL, MY_PRODUCT_LIST_REQUEST, MY_PRODUCT_LIST_SUCCESS, MY_PRODUCT_LIST_FAIL } from "../constants/productConstants"
import axios from 'axios';
import { ALL_LIKES } from "../constants/likeConstants";
import { getAllLikes, removeAllLikeOfProduct, addLikeEntry } from "./likeActions";

const listProducts = (
    category = '',
    searchKeyword = '',
    priceOrder = '',
    genderOrder = '',
    countryOrder = '',
    ) => async (dispatch) => {
    try{
        dispatch({type:PRODUCT_LIST_REQUEST});
        //send ajax request to server
        const {data} = await axios.get(
            '/api/products?category=' +
            category +
            '&searchKeyword=' +
            searchKeyword +
            '&priceOrder=' +
            priceOrder +
            '&genderOrder=' +
            genderOrder +
            '&countryOrder=' +
            countryOrder 
        );
        dispatch({type: PRODUCT_LIST_SUCCESS, payload: data});
        console.log("before getAllLikes");
        //get all likes after getting products
        dispatch(getAllLikes(data));
        
    }
    catch(error)
    {
        dispatch({type: PRODUCT_LIST_FAIL, payload: error.message});
    }
    
}

const listMyProducts = () => async (dispatch, getState) => {
    try{
        const {userSignin: {userInfo}} = getState();
        dispatch({type:MY_PRODUCT_LIST_REQUEST});
        //send ajax request to server
        const {data} = await axios.get(
            '/api/products/mine', {
                headers: {
                    'Authorization': 'Bearer ' + userInfo.token
                }
        });
        
        dispatch({type: MY_PRODUCT_LIST_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type: MY_PRODUCT_LIST_FAIL, payload: error.message});
    }
}

const detailsProducts = (productId) => async (dispatch) => {
    try{
        dispatch({type:PRODUCT_DETAILS_REQUEST, payload: productId});
        const {data} = await axios.get("/api/products/" + productId);
        dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data});
    }
    catch(error)
    {
        dispatch({type: PRODUCT_DETAILS_FAIL, payload: error.message});
    }
}

const saveProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({type: PRODUCT_SAVE_REQUEST, payload: product});
        const {userSignin: {userInfo}} = getState();

        if(!product._id){
            const {data} = await axios.post('/api/products', product, {
                headers: {
                    'Authorization': 'Bearer ' + userInfo.token
                }
            });
            dispatch({type: PRODUCT_SAVE_SUCCESS, payload: data});
            //create new like entry in likes dict
            dispatch(addLikeEntry(data._id));
        }
        else{
            const {data} = await axios.put('/api/products/'+product._id, product, {
                headers: {
                    'Authorization': 'Bearer ' + userInfo.token
                }
            });
            dispatch({type: PRODUCT_SAVE_SUCCESS, payload: data});
        }

    } catch (error) {
        dispatch({type: PRODUCT_SAVE_FAIL, payload: error.message});
    }
}

const deleteProduct = (productId) => async (dispatch, getState) => {
    try{
        const {userSignin: {userInfo}} = getState();
        dispatch({type:PRODUCT_DELETE_REQUEST, payload: productId});
        const {data} = await axios.delete("/api/products/" + productId, {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token//???????
            }
        });
        dispatch({type: PRODUCT_DELETE_SUCCESS, payload: data});
        //delete all likes of this product
        dispatch(removeAllLikeOfProduct(productId));
    }
    catch(error)
    {
        dispatch({type: PRODUCT_DELETE_FAIL, payload: error.message});
    }
}

const saveProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        const {userSignin: {userInfo}} = getState();
      dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        review,
        {
          headers: {
            Authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
    } catch (error) {
      // report error
      dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
    }
  };

export {listProducts, detailsProducts, saveProduct, deleteProduct, saveProductReview, listMyProducts}