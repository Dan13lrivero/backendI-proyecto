import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartManager.updateCartProducts(cid, products);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.removeProductFromCart(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.clearCart(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

export default router;
