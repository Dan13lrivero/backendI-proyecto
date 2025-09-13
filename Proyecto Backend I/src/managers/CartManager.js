import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const CartModel = mongoose.model('carts', cartSchema);

export default class CartManager {
  async createCart() {
    const newCart = await CartModel.create({ products: [] });
    return newCart.toObject();
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate('products.product').lean();
    return cart || null;
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const objId = new mongoose.Types.ObjectId(productId);
    const existingProduct = cart.products.find(p => p.product.toString() === objId.toString());

    if (existingProduct) existingProduct.quantity += 1;
    else cart.products.push({ product: objId, quantity: 1 });

    await cart.save();
    return cart.toObject();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const objId = new mongoose.Types.ObjectId(productId);
    const product = cart.products.find(p => p.product.toString() === objId.toString());
    if (!product) return null;

    product.quantity = quantity;
    await cart.save();
    return cart.toObject();
  }

  async updateCartProducts(cartId, products) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = products.map(p => ({
      product: new mongoose.Types.ObjectId(p.product),
      quantity: p.quantity
    }));

    await cart.save();
    return cart.toObject();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const objId = new mongoose.Types.ObjectId(productId);
    cart.products = cart.products.filter(p => p.product.toString() !== objId.toString());

    await cart.save();
    return cart.toObject();
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}
