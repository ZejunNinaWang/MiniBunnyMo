import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    country: { type: String, default: 'Canada',required: true },
    price: { type: Number, default: 0, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, default: 0, required: true },
    description: { type: String, required: true },
    gender: { type: String, default: 'male', required: true },
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    reviews: [reviewSchema],
    // seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //reference to the User table
    sellerEmail: { type: String, required: true }
  });

const Product = mongoose.model("Product", productSchema);

export default Product;