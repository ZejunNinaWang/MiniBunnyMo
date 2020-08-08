import { USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNIN_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_LOGOUT, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_AVATAR_SAVE_SUCCESS, USER_AVATAR_SAVE_FAIL, USER_AVATAR_SAVE_REQUEST, USER_AVATAR_SAVE_RESET } from "../constants/userConstants";


// function userRegisterReducer(state={}, action){
//     switch (action.type){
//         case USER_REGISTER_REQUEST:
//             return {loading: true};
//         case USER_REGISTER_SUCCESS:
//             return {loading: false, userInfo: action.payload};
//         case USER_REGISTER_FAIL:
//             return {loading: false, error: action.payload};
//         default: return state;
//     }
// }

function userSigninReducer(state={}, action){
    switch (action.type){
        //signin
        case USER_SIGNIN_REQUEST:
            return {loading: true, };
        case USER_SIGNIN_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_SIGNIN_FAIL:
            return {loading: false, error: action.payload};

        //register
        case USER_REGISTER_REQUEST:
            return {loading: true};
        case USER_REGISTER_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_REGISTER_FAIL:
            return {loading: false, error: action.payload};

        //logout
        case USER_LOGOUT:
            return {};

        default: return state;
    }
}

function userUpdateReducer(state={}, action){
    switch (action.type){
        //signin
        case USER_UPDATE_REQUEST:
            return {loading: true};
        case USER_UPDATE_SUCCESS:
            return {loading: false, success: true, userInfo: action.payload};
        case USER_UPDATE_FAIL:
            return {loading: false, error: action.payload};

        default: return state;
    }
}

function userAvatarSaveReducer(state={}, action) {
    switch(action.type){
        case USER_AVATAR_SAVE_REQUEST:
            return {loading: true};
        case USER_AVATAR_SAVE_SUCCESS:
            return {loading: false, avatar: action.payload, success: true};
        case USER_AVATAR_SAVE_FAIL:
            return {loading: false, error: action.payload}
        case USER_AVATAR_SAVE_RESET:
            return {};
        default:
            return state;
    }
}




export{
    userSigninReducer, userUpdateReducer, userAvatarSaveReducer/*userRegisterReducer*/
}