import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
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

export default class ProductManager {
  constructor() {}

  async getProducts() {
    return await Product.find().lean();
  }

  async getProductById(id) {
    const product = await Product.findOne({ id: Number(id) }).lean();
    return product || null;
  }

  async addProduct(productData) {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = { ...productData, id: newId, status: true };
    await Product.create(newProduct);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number(id) },
      updates,
      { new: true, lean: true }
    );
    return updatedProduct;
  }

  async deleteProduct(id) {
    const result = await Product.deleteOne({ id: Number(id) });
    return result.deletedCount > 0;
  }

  async initProducts(jsonPath) {
    const count = await Product.countDocuments();
    if (count === 0) {
      const fs = await import("fs/promises");
      const data = await fs.readFile(jsonPath, "utf-8");
      const products = JSON.parse(data);
      await Product.insertMany(products);
    }
  }
}
