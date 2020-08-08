import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';
import { saveProduct, listProducts, deleteProduct, listMyProducts } from '../actions/productActions';
import axios from 'axios';



function ProductsScreen(props){
    const [modelVisible, setModelVisible] = useState(false); //hide product table by default

    //product info of currently created/updated product
    const [id, setId] = useState('');//undefined when creating product
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [country, setCountry] = useState('');
    const [category, setCategory] = useState('');
    const [gender, setGender] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const [inCompleteInfo, setInCompleteInfo] = useState(false);

    // const productList = useSelector(state=>state.productList);
    // const {loading, products, error} = productList;

    const productSave = useSelector(state => state.productSave);
    const {loading: loadingSave, success: successSave, error: errorSave} = productSave;

    const myProductList = useSelector(state => state.myProductList);
    const {loading, products, error} = myProductList;

    const productDelete = useSelector(state=>state.productDelete);
    const {loading: loadingDelete, success: successDelete, error: errorDelete} = productDelete;

    const dispatch = useDispatch();

    useEffect(() => { 
        //if save product success, close product form
        if(successSave){
            setModelVisible(false);
        }
        dispatch(listMyProducts());
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
        setCountry(product.country);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setGender(product.gender);
      };

    const submitHandler = (e) => {
        e.preventDefault();
        if(!name || !image || !country || !category || !description){
            console.log("Incomplete product infomation");
            setInCompleteInfo(true);

        }
        else{
            setInCompleteInfo(false);
            console.log("in submit: ", name)
            dispatch(saveProduct({
                _id: id,
                name,
                price,
                image,
                country,
                category,
                countInStock,
                description,
                gender,
              }));
        }

    }


    const deleteHandler = (productId) =>{
        dispatch(deleteProduct(productId));
    }

    const uploadFileHandler = (e) => {
        const file = e.target.files[0]; //access the single file

        const bodyFormData = new FormData();
        bodyFormData.append('image', file); //so we can send ajax request 
        setUploading(true);
        axios.post('/api/uploads', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            console.log("upload success ", response.data.file.filename);
            setImage(response.data.file.filename);
            setUploading(false);
        }).catch(err => {
            console.log(err);
            setUploading(false);
        });

    }

    return(
        
    <div className="content content-margined">
        <div className="product-header">
            <h3>Your Pets</h3>
            <button className="button"onClick={() => openModal({})}>Add Your Pet</button>
        </div>
        

        
        {modelVisible &&
        <div className='form'>
            <form onSubmit={submitHandler}>
                <ul className="form-container">
                    <li><h2>Add Your Pet</h2></li>
                    {loadingSave && <div>Loading</div>}
                    {errorSave && <div className="error">{errorSave}</div>}
                    {inCompleteInfo && <div className="error">Please complete product infomation</div>}
                    <li>
                        <label htmlFor="name">Title</label>
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
                        {/* <input
                        type="text"
                        name="image"
                        value={image}
                        id="image"
                        onChange={(e) => setImage(e.target.value)}
                        ></input> */}
                        {image != '' ? image:''}
                        <input type="file" onChange={uploadFileHandler}></input>
                        {uploading && <div>Uploading...</div>}
                    </li>
                    {/* <li>
                        <label htmlFor="country">Country</label>
                        <input
                        type="text"
                        name="country"
                        value={country}
                        id="country"
                        onChange={(e) => setCountry(e.target.value)}
                        ></input>
                    </li> */}
                    <li>
                        <label htmlFor="country">Country</label>
                        <select name="country" 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}>
                            <option value="">-Choose a country-</option>
                            <option value="Canada">Canada</option>
                            <option value="United States">United States</option>
                        </select>
                    </li>
                    <li>
                        <label htmlFor="gender">Gender</label>
                        <select name="gender" 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}>
                            <option value="">-Choose a gender-</option>
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                    </li>
                    <li>
                        <label htmlFor="countInStock">Count in stock</label>
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
                        <label htmlFor="category">Category</label>
                        <select name="category" 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="">-Choose a category-</option>
                            <option value="Cashmere Lop">Cashmere Lop</option>
                            <option value="American Fuzzy Lop">American Fuzzy Lop</option>
                            <option value="French Lop">French Lop</option>
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
                    <button 
                    type="submit" 
                    className="button"
                    disabled={!name || !image || !country || !category || !description}
                    >{id? "Edit" : "Create"}</button>
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
            {
                products && products.length !== 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Gender</th>
                            <th>Country</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map(product => (
                            <tr>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.gender}</td>
                                <td>{product.country}</td>
                                <td>
                                    <button className="button secondary" onClick={() => openModal(product)}>Edit</button>
                                    {' '}
                                    <button className="button secondary" onClick={() => deleteHandler(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                :
                <div>You don't have pets added yet.</div>
            }
            

        </div>
    </div>
        
    )
}

export default ProductsScreen;