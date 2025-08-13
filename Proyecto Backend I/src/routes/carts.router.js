import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/cart.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado para agregar producto' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

export default router;
