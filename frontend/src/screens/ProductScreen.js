import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProducts, saveProductReview } from '../actions/productActions';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';
import { productReviewSaveReducer } from '../reducers/productReducers';
import Like from '../components/Like';
import { removeLikeProduct, likeProduct, getAllLikes } from '../actions/likeActions';


function ProductScreen(props){
    //const product = data.products.find(x => x._id === props.match.params.id)
    const [qty, setQty] = useState(1); 
    const productDetails = useSelector(state => state.productDetails);
    const {product, loading, error} = productDetails;

    const likes = useSelector(state => state.likes);
    const {likesByProductId} = likes;
    

    //props for review section
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const productReviewSave = useSelector(state => state.productReviewSave);
    const {success: productReviewSaveSuccess} = productReviewSave;

    const dispatch = useDispatch();

    useEffect(() => {
        if(productReviewSaveSuccess){
            //alert('Review submitted successfully.');
            setComment('');
            setRating(1);

            dispatch({type: PRODUCT_REVIEW_SAVE_RESET});
            window.location.reload();
        }

        dispatch(detailsProducts(props.match.params.id));   

        return () => {

        };
    }, [productReviewSaveSuccess]);

    useEffect(() => {
        dispatch(getAllLikes());
    }, [])

    const handleAddToCart = () => {
        //redirect
        props.history.push("/cart/" + props.match.params.id + "?qty=" + qty);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch actions
        dispatch(
          saveProductReview(props.match.params.id, {
            name: userInfo.name,
            rating: rating,
            comment: comment,
          })
        );
      };

      const like = (productId) => {
        if(likesByProductId[productId] === true){
            //if already like, then remove like
            dispatch(removeLikeProduct(productId));
        } else {
            //like
            dispatch(likeProduct(productId));
        }
        

    }

    return(
        <div className="content-margined">
            <div className="back-to-result">
                <Link to="/">Back to results</Link>
            </div>
            {/* {loading ? <div className="loading"><i className="fa fa-spinner fa-spin"></i></div> : */}
            {loading ? <div className="loading"><img className="no-result-found" src="/masks/loading.GIF"/></div> :
            error ? <div>{error}</div> : 
                (
                    <>
                    <div className="details">
                        <div className="details-image">
                        <img  src={"../api/image/"+product.image} alt="product"/>
                        </div>
                        <div className="details-info">
                            <ul>
                                
                                {/* <li className="product-category">s{product.category}</li> */}
                                <li>
                                    {/* <a href="#reviews"> */}
                                        {/* <Rating value={product.rating} text={product.numReviews + ' reviews'}/> */}
                                    {/* </a> */}
                                    <div className="details-like">
                                    <Link onClick={() => like(product._id)}>
                                        <Like like={likesByProductId[product._id]}/>
                                    </Link>

                                    </div>

                                </li>
                                <li>
                                    <h4>{product.name}</h4>
                                </li>
                                <li>
                                    Price: <b>${product.price}</b>
                                </li>
                                <li>
                                    Gender: {product.gender}
                                </li>
                                <li>
                                    Seller Contact: 
                                    <div>
                                    {product.sellerEmail}
                                    </div>
                                    
                                </li>
                                <li>
                                    Description:
                                    <div className='details-description'>
                                        {product.description}
                                    </div>
                                </li>
                            </ul>

                        </div>
                        <div className="details-action">
                            <ul>
                                <li>Price: {product.price}</li>
                                <li>Status: {product.countInStock > 0 ? "In Stock" : "Out of Stock" }</li>
                                <li>
                                    Qty:
                                    <select value={qty} onChange={(e) => {setQty(e.target.value)}}>
                                     {[...Array(product.countInStock).keys()].map( x => 
                                        <option key={x+1} value={x+1}> {x+1} </option>)}
                                    </select>
                                </li>
                                <li>
                                    <button onClick={handleAddToCart} disabled={product.countInStock <= 0} className="button">Add to Cart</button>
                                </li>
                            </ul>

                        </div>  

                    </div>
                    <div >
                        <h2>Comments</h2>
                        
                        <ul className="review" id="reviews"> 
                        {product.numReviews === 0 ? <li><p>There is no review</p></li> : 
                        
                        product.reviews.map((review) => (
                            <li className="review-item" key={review._id}>
                            <div className="review-name">{review.name}</div>
                            {/* <div>
                                <Rating value={review.rating}></Rating>
                            </div> */}
                            <div className="review-date">{review.createdAt.substring(0, 10)}</div>
                            <div className="review-comment">{review.comment}</div>
                            </li>
                        ))}
                        <li>
                            <h3>Write a comment</h3>
                            {userInfo && userInfo.name ? (
                            <form onSubmit={submitHandler}>
                                <ul className="form-container">
                                {/* <li>
                                    <label htmlFor="rating">Rating</label>
                                    <select
                                    name="rating"
                                    id="rating"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    >
                                    <option value="1">1- Poor</option>
                                    <option value="2">2- Fair</option>
                                    <option value="3">3- Good</option>
                                    <option value="4">4- Very Good</option>
                                    <option value="5">5- Excelent</option>
                                    </select>
                                </li> */}
                                <li>
                                    <label htmlFor="comment">Comment</label>
                                    <textarea
                                    name="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </li>
                                <li>
                                    <button type="submit" className="button primary">
                                    Submit
                                    </button>
                                </li>
                                </ul>
                            </form>
                            ) : (
                            <div>
                                Please <Link to="/signin">Sign-in</Link> to write a review.
                            </div>
                            )}
                        </li>
                        </ul>
                        
                    </div>
                    </>
                )
            
            
            }

        </div>
            
    )
}

export default ProductScreen;