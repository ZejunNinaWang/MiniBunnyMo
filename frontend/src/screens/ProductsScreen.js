import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';
import { saveProduct, listProducts, deleteProduct, listMyProducts } from '../actions/productActions';
import axios from 'axios';
import * as mobilenet from "@tensorflow-models/mobilenet";
import { set } from 'js-cookie';



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

    const [fileUploadError, setFileUploadError] = useState(null);
    const [mobileNetModel, setMobileNetModel] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const imageRef = useRef();
    const [imageURL, setImageURL] = useState(null);
    
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

    //load mobilenet model when page loads
    useEffect(() => {
        const loadMobileNetModel = async () => {
            const model = await mobilenet.load();
            setMobileNetModel(model);
        }
        loadMobileNetModel();
        
    }, [])

    useEffect(() => {
        setImageURL(null);
        setFileUploadError(null);

    }, [modelVisible])

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
        if(!name || !image || !country || !category || !description || !gender || !price || !countInStock){
            setInCompleteInfo(true);

        }
        else{
            setInCompleteInfo(false);
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

    const detailHandler = (productId) => {
        props.history.push('/product/'+productId);
    }

    const uploadFile = async (file) => {
        if(imageRef.current){
            setVerifying(true);
            const results = await mobileNetModel.classify(imageRef.current);
            let imageValidated = false;
            results.forEach(result => {
                if(result.className.includes("rabbit") || result.className.includes("cat") || result.className.includes("dog")){
                    imageValidated = true || imageValidated;
                }
            });
            setVerifying(false);

            // if image is a animal, upload image to DB
            if(imageValidated){
                const bodyFormData = new FormData();
                bodyFormData.append('image', file); //so we can send ajax request 
                setUploading(true);
                axios.post('/api/uploads', bodyFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {
                    // console.log("upload success ", response.data.file.filename);
                    setImage(response.data.file.filename);
                    setUploading(false);
                }).catch(err => {
                    setFileUploadError('Failed to upload image to server.' + err);
                    setUploading(false);
                });

            }
            else{
                //image is not animal
                setFileUploadError("Animal not detected. Please try again.");
            }
        }
    }

    const validateFileHandler = async (e) => {
        setFileUploadError(null);
        setImageURL(null);
        if(e.target.files.length === 0)
            return;
            
        const file = e.target.files[0]; //access the single file
        
        //check file type
        const fileType = file.type;
        if(fileType !== 'image/png' && fileType !== 'image/jpeg'){
            setFileUploadError("Please upload a png or jpg file.");
            return;
        }

        //validate the image it's an animal before uploading to DB
        const url = URL.createObjectURL(file);
        setImageURL(url);
        uploadFile(file);
        
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
                    {loadingSave && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
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
                        {image ? <div className="loading-text">Image verified and uploaded as ${image}</div> : ''}
                        <input type="file" onChange={validateFileHandler} ></input>
                        {uploading && <div className="loading"><i className="fa fa-spinner fa-spin"></i></div>}
                        {fileUploadError && <div className="error">{fileUploadError}</div>}
                        {verifying && <div className="loading">Verifying image <i className="fa fa-spinner fa-spin"></i></div>}
                        
                        <img id='upload-image' src={imageURL} alt="upload-preview" ref={imageRef} style={{
                        width: '10rem', height: 'auto', padding: '0.5rem'}}/>
                        
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
                        <label htmlFor="category">Category</label>
                        <select name="category" 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="">-Choose a category-</option>
                            <option value="Cashmere Lop">Cashmere Lop</option>
                            <option value="American Fuzzy Lop">American Fuzzy Lop</option>
                            <option value="French Lop">French Lop</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
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
                        // disabled={!name || !image || !country || !category || !description || !gender || !price || !countInStock}
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
                loading ? <div className="loading"><img className="no-result-found" src="/masks/loading.GIF"/></div> :
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
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.gender}</td>
                                <td>{product.country}</td>
                                <td>
                                    <button className="button secondary" onClick={() => openModal(product)}>Edit</button>
                                    {' '}
                                    <button className="button secondary" onClick={() => deleteHandler(product._id)}>Delete</button>
                                    {/* {' '} */}
                                    {/* <button className="button secondary" onClick={() => detailHandler(product._id)}>Details</button> */}
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