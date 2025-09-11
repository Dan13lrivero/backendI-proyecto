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
    console.log('Carrito creado:', newCart);
    return newCart.toObject();
  }

  async getCartById(id) {
    const cart = await CartModel.findById(id).populate('products.product').lean();
    if (!cart) console.log('Carrito no encontrado:', id);
    else console.log('Carrito obtenido:', cart);
    return cart || null;
  }

  async addProductToCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log('Carrito no encontrado al agregar producto:', cartId);
      return null;
    }

    const objId = new mongoose.Types.ObjectId(productId);

    const existingProduct = cart.products.find(p => p.product.toString() === objId.toString());
    if (existingProduct) existingProduct.quantity += 1;
    else cart.products.push({ product: objId, quantity: 1 });

    await cart.save();
    console.log('Producto agregado al carrito:', cart);
    return cart.toObject();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log('Carrito no encontrado al actualizar cantidad:', cartId);
      return null;
    }

    const objId = new mongoose.Types.ObjectId(productId);
    const product = cart.products.find(p => p.product.toString() === objId.toString());
    if (!product) {
      console.log('Producto no encontrado en el carrito:', productId);
      return null;
    }

    product.quantity = quantity;
    await cart.save();
    console.log('Cantidad actualizada en carrito:', cart);
    return cart.toObject();
  }

  async updateCartProducts(cartId, products) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log('Carrito no encontrado al actualizar productos:', cartId);
      return null;
    }

    cart.products = products.map(p => ({
      product: new mongoose.Types.ObjectId(p.product),
      quantity: p.quantity
    }));

    await cart.save();
    console.log('Carrito actualizado con nuevos productos:', cart);
    return cart.toObject();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log('Carrito no encontrado al eliminar producto:', cartId);
      return null;
    }

    const objId = new mongoose.Types.ObjectId(productId);
    cart.products = cart.products.filter(p => p.product.toString() !== objId.toString());

    await cart.save();
    console.log('Producto eliminado del carrito:', cart);
    return cart.toObject();
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log('Carrito no encontrado al vaciar:', cartId);
      return null;
    }

    cart.products = [];
    await cart.save();
    console.log('Carrito vaciado:', cart);
    return cart.toObject();
  }
}
