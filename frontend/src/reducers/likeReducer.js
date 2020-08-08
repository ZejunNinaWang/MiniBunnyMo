import { ALL_LIKES, ADD_LIKE, REMOVE_LIKE, RESET_LIKE, ADD_LIKE_ENTRY, REMOVE_ADD_ENTRY } from "../constants/likeConstants";


function likesByProductIdReducer(state={likesByProductId:{}}, action){
    
    switch(action.type){
        case ALL_LIKES:
            const {products, likedProducts} = action;
            //if dict not exist, create it
            if(Object.keys(state.likesByProductId).length === 0){
                //create dict of all product id as keys, set value to false
                const likesDict = {};
                products.forEach(product => {
                    likesDict[[product._id]] = false;
                });
                //loop likedProducts(has user id), set value to true
                likedProducts.forEach(like => {
                    likesDict[like.productId] = true;
                });

                return {likesByProductId: likesDict};
            } 

            return state;

        case ADD_LIKE:
            //change like state to TRUE by product id and user id given by action
            const {likeProductId} = action;
            return {
                likesByProductId: {
                    ...state.likesByProductId,
                    [likeProductId]: true
                }
            }

        case REMOVE_LIKE:
            //change like state to FALSE by product id and user id given by action
            const {removeLikeProductId} = action;
            return {
                likesByProductId: {
                    ...state.likesByProductId,
                    [removeLikeProductId]: false
                }
            }


        case RESET_LIKE:
            //calle when logout, sign in
            //clear dict
            return {likesByProductId:{}};



        case ADD_LIKE_ENTRY:
            //called when create new product

        case REMOVE_ADD_ENTRY:
            //called when delete product


        default:
            return state;
    }
}

export {likesByProductIdReducer}