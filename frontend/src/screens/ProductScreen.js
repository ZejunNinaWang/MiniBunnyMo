import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProducts } from '../actions/productActions';


function ProductScreen(props){
    //const product = data.products.find(x => x._id === props.match.params.id)
    const [qty, setQty] = useState(1); 
    const productDetails = useSelector(state => state.productDetails);
    const {product, loading, error} = productDetails;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(detailsProducts(props.match.params.id));    

        return () => {

        };
    }, []);

    const handleAddToCart = () => {
        //redirect
        props.history.push("/cart/" + props.match.params.id + "?qty=" + qty);
    }
    return(
        <div>
            <div className="back-to-result">
                <Link to="/">Back to results</Link>
            </div>
            {loading ? <div>Loading...</div> :
            error ? <div>{error}</div> : 
                (
                    <div className="details">
                        <div className="details-image">
                            <img src={product.image} alt="product"></img>
                        </div>
                        <div className="details-info">
                            <ul>
                                <li>
                                    <h4>{product.name}</h4>
                                </li>
                                <li>
                                    {product.rating} Carrots ({product.numReviews})
                                </li>
                                <li>
                                    Price: <b>${product.price}</b>
                                </li>
                                <li>
                                    Description:
                                    <div>
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
        
                )
            
            
            }

        </div>
            
    )
}

export default ProductScreen;