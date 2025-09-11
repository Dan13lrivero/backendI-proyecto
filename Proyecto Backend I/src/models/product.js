import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  category: String,
  status: { type: Boolean, default: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
