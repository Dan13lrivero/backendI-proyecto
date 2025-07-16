import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/carts.json');

export default class CartManager {
  constructor() {
    this.path = filePath;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      console.log('Archivo de carritos leido correctamente');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer archivo de carritos:', error);
      return [];
    }
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
      console.log('Archivo de carritos actualizado correctamente');
    } catch (error) {
      console.error('Error al escribir archivo de carritos:', error);
    }
  }

  async createCart() {
    const carts = await this.readFile();

    const newId = carts.length > 0
      ? Math.max(...carts.map(c => Number(c.id))) + 1
      : 1;

    const newCart = {
      id: newId.toString(),
      products: []
    };

    carts.push(newCart);
    await this.writeFile(carts);
    console.log('Nuevo carrito creado:', newCart);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.readFile();
    const cart = carts.find(c => c.id === id);
    if (cart) {
      console.log(`Carrito encontrado con id ${id}`);
    } else {
      console.log(`Carrito NO encontrado con id ${id}`);
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.readFile();
    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
      console.log(`Carrito no encontrado con id ${cartId}`);
      return null;
    }

    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
      console.log(`El producto ya existe en el carrito, nueva cantidad: ${existingProduct.quantity}`);
    } else {
      cart.products.push({ product: productId, quantity: 1 });
      console.log(`Producto agregado al carrito con id ${cartId}: ${productId}`);
    }

    await this.writeFile(carts);
    console.log(`Carrito actualizado con id ${cartId}`);
    return cart;
  }
}
