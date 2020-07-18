import express from 'express';
import Product from '../models/productModel';
import { getToken } from '../util';

const productRoute = express.Router();
productRoute.get("/", async (req, res) => {
  try {
      //get list of products
      const products = await Product.find({});
      res.send(products);
  } catch (error) {
    res.status(500).send({msg: error.message});
  }
})

productRoute.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    const newProduct = await product.save();
    if(newProduct){
      res.status(201).send({msg: "New Product Created", data: newProduct});
    }
    else
    {
      res.status(500).send({msg: 'Error in Creating Product.'});
    }
  } catch (error) {
      res.status(500).send({msg: error.message});
  }
})

 
export default productRoute;