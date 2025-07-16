import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/products.json');

export default class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      console.log('Archivo leido correctamente');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return []; 
    }
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
      console.log('Archivo escrito correctamente');
    } catch (error) {
      console.error('Error escribiendo archivo:', error);
    }
  }

  async getProducts() {
    const products = await this.readFile();
    console.log(`Se obtuvieron ${products.length} productos`);
    return products;
  }

  async getProductById(id) {
    const products = await this.readFile();
    const product = products.find(p => p.id === id);
    if (product) {
      console.log(`Producto encontrado con id ${id}`);
    } else {
      console.log(`Producto NO encontrado con id ${id}`);
    }
    return product;
  }

  async addProduct(product) {
    const products = await this.readFile();

    const newId = products.length > 0
      ? Math.max(...products.map(p => Number(p.id))) + 1
      : 1;

    const newProduct = {
      id: newId.toString(),
      status: true,
      ...product
    };

    products.push(newProduct);
    await this.writeFile(products);
    console.log('Producto agregado:', newProduct);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.readFile();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) {
      console.log(`No se encontró producto para actualizar con id ${id}`);
      return null;
    }

    const updatedProduct = {
      ...products[index],
      ...updates,
      id: products[index].id 
    };

    products[index] = updatedProduct;
    await this.writeFile(products);
    console.log('Producto actualizado:', updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.readFile();
    const newProducts = products.filter(p => p.id != id);

    if (newProducts.length === products.length) {
      console.log(`No se encontró producto para eliminar con id ${id}`);
      return false;
    }

    await this.writeFile(newProducts);
    console.log(`Producto eliminado con id ${id}`);
    return true;
  }
}
