import React, { useEffect } from 'react';
//import data from '../data';
import { Link } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';

function HomeScreen(props){

    //const [products, setProducts] = useState([]); 

    //map state to props
    const productList = useSelector(state => state.productList); // productList is set to the state defined from the productList reducer
    const {products, loading, error} = productList;

    const dispatch = useDispatch();

    //didMount
    useEffect(() => {
        // const fetchData = async () => {
        //     const {data} = await axios.get("/api/products");
        //     setProducts(data);
        // }
        // fetchData();
        // redux can guarantee that the dispatch function will not change between renders.
        // so we don't need to wrap it with useCallback for now.
        dispatch(listProducts());
        return () => {
            //clean up
        };
    }, [])

    return(
        loading ? <div>loading...</div> :
        error ? <div>{error}</div> :
        <div>
        <p>HomeScreen</p>
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
                            <div className="product-gender">{product.gender}</div>
                            <div className="product-price">${product.price}</div>
                            <div className="product-rating">{product.rating} Carrots ({product.numReviews})</div>
                        </div>
                    </li>
                    )
                })
            }
            
        </ul>
        </div>
    )
}

export default HomeScreen;