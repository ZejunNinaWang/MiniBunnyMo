import React, { useEffect, useState } from 'react';
//import data from '../data';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';

function HomeScreen(props){
    const category = props.match.params.id ? props.match.params.id : '';
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    //map state to props
    const productList = useSelector(state => state.productList); // productList is set to the state defined from the productList reducer
    const {products, loading, error} = productList;

    const dispatch = useDispatch();

    //didMount
    useEffect(() => {
        // redux can guarantee that the dispatch function will not change between renders.
        // so we don't need to wrap it with useCallback for now.
        console.log("category is ", category);
        console.log("searchKeyword is ", searchKeyword);
        console.log("sortOrder is ", sortOrder);
        dispatch(listProducts(category, searchKeyword, sortOrder));
        return () => {
            //clean up
        };
    }, [category, sortOrder])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(listProducts(category, searchKeyword, sortOrder));
      };


    // const sortHandler = (e) => {
    //     console.log("In sortHandler: e.target.value is ",e.target.value );
    //     setSortOrder(e.target.value);
    //     console.log("In sortHandler: sortOrder is ",sortOrder );
    //     dispatch(listProducts(category, searchKeyword, sortOrder));
    //   };
    

    return(
        <div>
            {category && <h2 className="category-title">{category}</h2>}

            <div className="filter">
                <div className="search">
                    <form onSubmit={submitHandler}>
                    <input
                        name="searchKeyword"
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button type="submit" className="button">Search</button>
                    </form>
                </div>
                
                <div className="filter-select">
                    Sort By{'  '}
                    {/* <select name="sortOrder" onChange={sortHandler}> */}
                    <select name="sortOrder" onChange={(e)=>setSortOrder(e.target.value)}>
                    <option value="">Newest</option>
                    <option value="lowest">Lowest</option>
                    <option value="highest">Highest</option>
                    </select>
                </div>
            </div>
            {
                loading ? <div>loading...</div> :
                error ? <div>{error}</div> :
                <div>
                {/* <p>HomeScreen</p> */}
                <ul className="products">
                    {     
                        products.map(product => {
                            return(
                            <li key={product._id}>
                                <div className="product">
                                    <Link to={'/product/' + product._id}>
                                        <img className="product-image" src={product.image} alt="product"/>
                                    </Link>
                                    <div className="product-name">
                                        <Link to={'/product/' + product._id}>{product.name}</Link>
                                    </div>
                                    <div className="product-category">{product.category}</div>
                                    <div className="product-price">${product.price}</div>
                                    {/* <div className="product-rating">{product.rating} Carrots ({product.numReviews} Reviews)</div> */}
                                    <div className="product-rating">
                                        <Rating value={product.rating} text={product.numReviews + ' reviews'}/>
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