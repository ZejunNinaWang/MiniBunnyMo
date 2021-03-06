import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util';

const productRoute = express.Router();

productRoute.get('/', async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const gender = req.query.genderOrder ? { gender: req.query.genderOrder } : {};
  const country = req.query.countryOrder ? { country: req.query.countryOrder } : {};
  const searchKeyword = req.query.searchKeyword
    ? { $or: [
          {name: {
              $regex: req.query.searchKeyword,
              $options: 'i', //case insensitive
            } 
          },
          {description: {
              $regex: req.query.searchKeyword,
              $options: 'i', //case insensitive
            } 
          }
        ]
      }
    : {};
  const priceOrder = req.query.priceOrder
    ? req.query.priceOrder === 'lowest'
      ? { price: 1 } //ascending
      : { price: -1 } //descending
    : { _id: -1 };
  const products = await Product.find({ ...category, ...searchKeyword, ...gender, ...country }).sort(priceOrder);
  res.send(products);

});

productRoute.get('/mine', isAuth, async (req, res) => {
  const products = await Product.find({ sellerEmail: req.user.email});
  res.send(products);
})

productRoute.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found.' });
  }
});

productRoute.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      country: req.body.country,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      gender: req.body.gender,
      sellerEmail: req.user.email
      // rating: req.body.rating,
      // numReviews: req.body.numReviews,
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


productRoute.put("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.country = req.body.country;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.gender = req.body.gender;

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


productRoute.delete("/:id", isAuth, isAdmin, async (req, res) => {
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

productRoute.post('/:id/reviews', isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) /product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      message: 'Review saved successfully.',
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

 
export default productRoute;