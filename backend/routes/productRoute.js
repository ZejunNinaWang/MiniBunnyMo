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
productRoute.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found.' });
  }
});

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
    const updatedProduct = await product.save();
    if(updatedProduct){
      res.status(201).send({msg: "New Product Created", data: updatedProduct});
    }
    else
    {
      res.status(500).send({msg: 'Error in Creating Product.'});
    }
  } catch (error) {
      res.status(500).send({msg: error.message});
  }
})


productRoute.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;

      const updatedProduct = await product.save();
      if(updatedProduct){
        res.status(200).send({msg: "Product Updated.", data: updatedProduct});
      }
      else
      {
        res.status(500).send({msg: 'Error in Updating Product.'});
      }
    }
  } catch (error) {
      res.status(500).send({msg: error.message});
  }
})


productRoute.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findById(req.params.id);
    if(deletedProduct){
      await deletedProduct.remove();
      res.send({msg: 'Product Deleted.'});
    }
    else{
      res.status(404).send({msg: 'Rroduct Not Found.'});
    }
    
  } catch (error) {
    res.status(500).send({msg: "Error in Deletion "+error.message});
  }
})

 
export default productRoute;