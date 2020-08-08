import Axios from 'axios';
import { ALL_LIKES, ADD_LIKE, REMOVE_LIKE, RESET_LIKE } from '../constants/likeConstants';
import { useSelector } from 'react-redux';
import store from '../store';

const getAllLikes = (products) => async (dispatch, getState) => {
    console.log('in getAllLikes')
    const {userSignin: {userInfo}, likes} = getState();
    
    const {likesByProductId} = likes;

    //if not cached, query DB
    if(Object.keys(likesByProductId).length === 0){
        console.log("Get all likes")
        try {
            //if no user id, dispatch with products
            if(!userInfo._id){
                dispatch({type: ALL_LIKES, likedProducts: [], products});
            //if user id, query backend like table with userid, get a list of productId as likedProducts
            //dispatch action with products and likedProducts
            } else {
                console.log('1')
                console.log('userInfo.token is ', userInfo.token);
                //get a list of liked products of this user
                const {data} = await Axios.get(
                    '/api/likes/'+userInfo._id, {
                        headers: {
                            'Authorization': 'Bearer ' + userInfo.token
                        }
                });
                console.log('likedProducts are ', data)
        
                dispatch({type: ALL_LIKES, likedProducts:data, products});
            }
            
        } catch {
            //TODO: add action 
        }
    }
    
}

const likeProduct = (productId) => async (dispatch, getState) => {
    
    try {
        const {userSignin: {userInfo}} = getState();

        if(userInfo._id){
            const {data} = await Axios.post(
                '/api/likes', {userId: userInfo._id, productId}, {
                    headers: {
                        'Authorization': 'Bearer ' + userInfo.token
                    }
            });
            dispatch({type: ADD_LIKE, likeProductId:productId});
        } else {
            console.log("no user id")
            //if no user id, no writing to DB
            dispatch({type: ADD_LIKE, likeProductId:productId});
        }
    } catch (error) {
        //TODO: add action 
    }
}

const removeLikeProduct = (productId) => async (dispatch, getState) => {
    
    try {
        const {userSignin: {userInfo}} = getState();

        if(userInfo._id){
            const {data} = await Axios.delete(
                `/api/likes/${userInfo._id}/`+productId, {
                    headers: {
                        'Authorization': 'Bearer ' + userInfo.token
                    }
            });
            dispatch({type: REMOVE_LIKE, removeLikeProductId: productId});
        } else {
            //if no user id, no writing to DB
            dispatch({type: REMOVE_LIKE, removeLikeProductId: productId});
        }
    } catch (error) {
        //TODO: add action 
    }
}

const resetLikes = () => async (dispatch, getState) => {
    //called when log out
    dispatch({type: RESET_LIKE});
}

export {getAllLikes, likeProduct, removeLikeProduct, resetLikes}