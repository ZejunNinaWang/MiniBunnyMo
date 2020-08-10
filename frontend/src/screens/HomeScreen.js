import React, { useEffect, useState } from 'react';
//import data from '../data';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';
import Like from '../components/Like';
import { likeProduct, removeLikeProduct } from '../actions/likeActions';

function HomeScreen(props){
    const category = props.match.params.id ? props.match.params.id : '';
    const [searchKeyword, setSearchKeyword] = useState('');
    const [priceOrder, setPriceOrder] = useState('');
    const [genderOrder, setGenderOrder] = useState('');
    const [countryOrder, setCountryOrder] = useState('');
    //map state to props
    const productList = useSelector(state => state.productList); // productList is set to the state defined from the productList reducer
    const {products, loading, error} = productList;

    const likes = useSelector(state => state.likes);
    const {likesByProductId} = likes;

    const dispatch = useDispatch();

    //didMount
    useEffect(() => {
        // redux can guarantee that the dispatch function will not change between renders.
        // so we don't need to wrap it with useCallback for now.
        dispatch(listProducts(category, searchKeyword, priceOrder, genderOrder, countryOrder));
        return () => {
            //clean up
        };
    }, [category])

    const search = (e) => {
        e.preventDefault();
        dispatch(listProducts(category, searchKeyword, priceOrder, genderOrder, countryOrder));
      };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            dispatch(listProducts(category, searchKeyword, priceOrder, genderOrder, countryOrder));
        }
    }

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
        <div>
            {/* {category && <h2 className="category-title">{category}</h2>} */}

            <div className="filter">
                
                
                <div className="filter-select">
                    Price{'  '}
                    {/* <select name="sortOrder" onChange={sortHandler}> */}
                    <select name="priceOrder" onChange={(e)=>setPriceOrder(e.target.value)}>
                    <option value="">- Any -</option>
                    <option value="lowest">Lowest</option>
                    <option value="highest">Highest</option>
                    </select>
                </div>

                <div className="filter-select">
                    Gender{'  '}
                    <select name="genderOrder" onChange={(e)=>setGenderOrder(e.target.value)}>
                    <option value="">- Any -</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    </select>
                </div>

                <div className="filter-select">
                    Country{'  '}
                    <select name="countryOrder" onChange={(e)=>setCountryOrder(e.target.value)}>
                    <option value="">- Any -</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                    </select>
                </div>
                <div className="search">
                    {/* <form onSubmit={submitHandler}> */}
                    Keyword Search{'  '}
                    <input 
                        name="searchKeyword"
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {/* <button type="submit" className="button">Search</button> */}
                    {/* </form> */}
                </div>

                <div>
                    <button type="submit" className="button" onClick={search}>Search</button>
                </div>
            </div>
            {
                // loading ? <div className="loading"><i className="fa fa-spinner fa-spin"></i></div> :
                loading ? <div className="loading"><img className="no-result-found" src="/masks/loading.GIF"/></div> :
                error ? <div>{error}</div> :
                products.length === 0 ? <div><img className="no-result-found" src="/masks/no_results_found.PNG"/></div> :
                <div>
                {/* <p>HomeScreen</p> */}
                <ul className="products">
                    {     
                        products.map(product => {
                            return(
                            <li key={product._id} className="grow">
                                <div className="product">
                                    <Link to={'/product/' + product._id}>
                                        {/* <img className="product-image" src={"api/image/"+product.image} alt="product"/> */}
                                        <img className="product-image" src={"../api/image/"+product.image} alt="product"/>
                                    </Link>
                                    <div className="product-name">
                                        <Link to={'/product/' + product._id}>{product.name}</Link>
                                    </div>
                                    <div className="product-category">{product.category}</div>
                                    <div className="product-price">${product.price}</div>
                                    {/* <div className="product-rating">{product.rating} Carrots ({product.numReviews} Reviews)</div> */}
                                    <div className="product-rating">
                                        {/* <Rating value={product.rating} text={product.numReviews + ' reviews'}/> */}
                                        <Link onClick={() => like(product._id)}>
                                        <Like like={likesByProductId[product._id]}/>
                                        </Link>
                                        
                                    </div>
                                    
                                </div>
                            </li>
                            )
                        })
                    }
                    
                </ul>
                </div>
            }
        </div>
    )
}

export default HomeScreen;