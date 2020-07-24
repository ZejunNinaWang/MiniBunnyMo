import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProducts, saveProductReview } from '../actions/productActions';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';
import { productReviewSaveReducer } from '../reducers/productReducers';


function ProductScreen(props){
    //const product = data.products.find(x => x._id === props.match.params.id)
    const [qty, setQty] = useState(1); 
    const productDetails = useSelector(state => state.productDetails);
    const {product, loading, error} = productDetails;
    

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
            alert('Review submitted successfully.');
            setComment('');
            setRating(1);

            dispatch({type: PRODUCT_REVIEW_SAVE_RESET});
        }

        dispatch(detailsProducts(props.match.params.id));    

        return () => {

        };
    }, [productReviewSaveSuccess]);

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

    return(
        <div>
            <div className="back-to-result">
                <Link to="/">Back to results</Link>
            </div>
            {loading ? <div>Loading...</div> :
            error ? <div>{error}</div> : 
                (
                    <>
                    <div className="details">
                        <div className="details-image">
                            <img src={product.image} alt="product"></img>
                        </div>
                        <div className="details-info">
                            <ul>
                                <li>
                                    <h4>{product.name}</h4>
                                </li>
                                {/* <li className="product-category">s{product.category}</li> */}
                                <li>
                                    {/* {product.rating} Carrots ({product.numReviews}) */}
                                    <a href="#reviews">
                                        <Rating value={product.rating} text={product.numReviews + ' reviews'}/>
                                    </a>
                                </li>
                                <li>
                                    Price: <b>${product.price}</b>
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
                    <div className="content-margined">
                        <h2>Reviews</h2>
                        
                        <ul className="review" id="reviews"> 
                        {product.numReviews === 0 ? <li><div>There is no review</div></li> : 
                        
                        product.reviews.map((review) => (
                            <li className="review-item" key={review._id}>
                            <div className="review-name">{review.name}</div>
                            <div>
                                <Rating value={review.rating}></Rating>
                            </div>
                            <div className="review-date">{review.createdAt.substring(0, 10)}</div>
                            <div className="review-comment">{review.comment}</div>
                            </li>
                        ))}
                        <li>
                            <h3>Write a customer review</h3>
                            {userInfo && userInfo.name ? (
                            <form onSubmit={submitHandler}>
                                <ul className="form-container">
                                <li>
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
                                </li>
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