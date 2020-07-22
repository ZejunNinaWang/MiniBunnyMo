import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';
import { saveProduct, listProducts, deleteProduct } from '../actions/productActions';


function ProductsScreen(props){
    const [modelVisible, setModelVisible] = useState(false); //hide product table by default

    //product info of currently created/updated product
    const [id, setId] = useState('');//undefined when creating product
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');

    const productList = useSelector(state=>state.productList);
    const {loading, products, error} = productList;

    const productSave = useSelector(state => state.productSave);
    const {loading: loadingSave, success: successSave, error: errorSave} = productSave;

    const productDelete = useSelector(state=>state.productDelete);
    const {loading: loadingDelete, success: successDelete, error: errorDelete} = productDelete;

    const dispatch = useDispatch();

    useEffect(() => { 
        //if save product success, close product form
        if(successSave){
            setModelVisible(false);
        }
        dispatch(listProducts());
        return () => {

        };
    }, [successSave, successDelete]);

    //open the product form
    //if user click create button: fields will be empty when open
    //if user click edit button: fields will be filled when open
    const openModal = (product) => {
        setModelVisible(true);
        setId(product._id);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
      };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveProduct({
            _id: id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
          }));
    }


    const deleteHandler = (productId) =>{
        dispatch(deleteProduct(productId));
    }

    return(
        
    <div className="content content-margined">
        <div className="product-header">
            <h3>Products</h3>
            <button className="button"onClick={() => openModal({})}>Create Product</button>
        </div>
        

        
        {modelVisible &&
        <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Create Product</h2></li>
                    {loadingSave && <div>Loading</div>}
                    {errorSave && <div>{errorSave}</div>}
                    <li>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={name} id="name" onChange={(e) => setName(e.target.value)}></input>
                    </li>
                    <li>
                        <label htmlFor="price">Price</label>
                        <input
                        type="text"
                        name="price"
                        value={price}
                        id="price"
                        onChange={(e) => setPrice(e.target.value)}
                        ></input>
                    </li>
                    <li>
                        <label htmlFor="image">Image</label>
                        <input
                        type="text"
                        name="image"
                        value={image}
                        id="image"
                        onChange={(e) => setImage(e.target.value)}
                        ></input>
                        {/* <input type="file" onChange={uploadFileHandler}></input>
                        {uploading && <div>Uploading...</div>} */}
                    </li>
                    <li>
                        <label htmlFor="brand">Brand</label>
                        <input
                        type="text"
                        name="brand"
                        value={brand}
                        id="brand"
                        onChange={(e) => setBrand(e.target.value)}
                        ></input>
                    </li>
                    <li>
                        <label htmlFor="countInStock">CountInStock</label>
                        <input
                        type="text"
                        name="countInStock"
                        value={countInStock}
                        id="countInStock"
                        onChange={(e) => setCountInStock(e.target.value)}
                        ></input>
                    </li>
                    {/* <li>
                        <label htmlFor="name">Category</label>
                        <input
                        type="text"
                        name="category"
                        value={category}
                        id="category"
                        onChange={(e) => setCategory(e.target.value)}
                        ></input>
                    </li> */}
                    <li>
                        <label htmlFor="name">Category</label>
                        <select name="category" onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Choose a category</option>
                            <option value="Cashmere Lop">Cashmere Lop</option>
                            <option value="American Fuzzy Lop">American Fuzzy Lop</option>
                        </select>
                    </li>
                    <li>
                        <label htmlFor="description">Description</label>
                        <textarea
                        name="description"
                        value={description}
                        id="description"
                        onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </li>
                    <li>
                    <button type="submit" className="button">{id? "Edit" : "Create"}</button>
                    </li>
                    <li>
                        <button
                        type="button"
                        onClick={() => setModelVisible(false)}
                        className="button secondary">
                        Back
                        </button>
                    </li>
                </ul>
            </form>
        </div>
        }   

        <div className="product-list">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <button className="button secondary" onClick={() => openModal(product)}>Edit</button>
                                {' '}
                                <button className="button secondary" onClick={() => deleteHandler(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    </div>
        
    )
}

export default ProductsScreen;