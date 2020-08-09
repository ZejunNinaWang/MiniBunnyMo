import Axios from "axios";
import Cookie from "js-cookie";
import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_LOGOUT, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_AVATAR_SAVE_REQUEST, USER_AVATAR_SAVE_SUCCESS, USER_AVATAR_SAVE_FAIL } from "../constants/userConstants";
import { userSigninReducer } from "../reducers/userReducers";
import { resetLikes } from "./likeActions";

const signin = (email, password) => async (dispatch) =>{
    dispatch({type: USER_SIGNIN_REQUEST, payload: {email, password}});
    try {
        const {data} = await Axios.post("/api/users/signin", {email, password});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data));
        dispatch(resetLikes());
    } catch (error) {
        dispatch({type: USER_SIGNIN_FAIL, payload: error.message});
    }
}

const update = ({userId, name, email, password}) => async (dispatch, getState) =>{
    
    try {
        dispatch({type: USER_UPDATE_REQUEST, payload: { userId, name, email, password}});
        const {userSignin: {userInfo}} = getState();
        const {data} = await Axios.put("/api/users/" + userId, {name, email, password}, 
        {
            headers: {
                'Authorization': 'Bearer ' + userInfo.token
            }
        }
        );
        dispatch({type: USER_UPDATE_SUCCESS, payload: data});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_UPDATE_FAIL, payload: error.message});
    }
}

const register = (name, email, password) => async (dispatch) =>{
    dispatch({type: USER_REGISTER_REQUEST, payload: {name, email, password}});
    try {
        const {data} = await Axios.post("/api/users/register", {name, email, password});
        dispatch({type: USER_REGISTER_SUCCESS, payload: data});
        Cookie.set('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({type: USER_REGISTER_FAIL, payload: error.message});
    }
}

const logout = () => (dispatch) => {
    Cookie.remove('userInfo');
    dispatch(resetLikes());
    dispatch({type: USER_LOGOUT});
}

const saveAvatar = (fileName) => async (dispatch, getState) => {
    try {
        dispatch({type: USER_AVATAR_SAVE_REQUEST, payload: fileName});
        const {userSignin: {userInfo}} = getState();
        if(userInfo._id){
            const { data } = await Axios.put(
                `/api/users/${userInfo._id}/avatars`,
                {fileName},
                {
                  headers: {
                    Authorization: 'Bearer ' + userInfo.token,
                  },
                }
            );
            dispatch({type: USER_AVATAR_SAVE_SUCCESS, payload: data});
            //Need to update userinfo as well
            dispatch({type: USER_UPDATE_SUCCESS, payload: data});
            dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
            Cookie.set('userInfo', JSON.stringify(data));
        }else{
            dispatch({type: USER_AVATAR_SAVE_FAIL, payload: "User id is undefined"});
        }
    } catch (error) {
        dispatch({type: USER_AVATAR_SAVE_FAIL, payload: error.message});
    }
}



export {signin, register, logout, update, saveAvatar};