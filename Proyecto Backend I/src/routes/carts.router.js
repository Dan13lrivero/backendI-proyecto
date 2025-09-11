import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  console.log("POST /api/carts → Crear carrito");
  try {
    const newCart = await cartManager.createCart();
    console.log("Carrito creado:", newCart);
    res.status(201).json(newCart);
  } catch (err) {
    console.error("Error al crear carrito:", err);
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  console.log(`GET /api/carts/${cid} → Obtener carrito`);
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      console.log("Carrito no encontrado:", cid);
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    console.log("Carrito encontrado:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  console.log(`POST /api/carts/${cid}/products/${pid} → Agregar producto`);
  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    if (!cart) {
      console.log("Carrito o producto no encontrado:", cid, pid);
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    console.log("Producto agregado al carrito:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  console.log(`PUT /api/carts/${cid}/products/${pid} → Actualizar cantidad a ${quantity}`);
  try {
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (!cart) {
      console.log("Carrito o producto no encontrado:", cid, pid);
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    console.log("Cantidad actualizada:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  console.log(`PUT /api/carts/${cid} → Reemplazar productos`, products);
  try {
    const cart = await cartManager.updateCartProducts(cid, products);
    if (!cart) {
      console.log("Carrito no encontrado:", cid);
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    console.log("Carrito actualizado:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al actualizar carrito:", err);
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  console.log(`DELETE /api/carts/${cid}/products/${pid} → Eliminar producto`);
  try {
    const cart = await cartManager.removeProductFromCart(cid, pid);
    if (!cart) {
      console.log("Carrito o producto no encontrado:", cid, pid);
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
    console.log("Producto eliminado del carrito:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al eliminar producto del carrito:", err);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  console.log(`DELETE /api/carts/${cid} → Vaciar carrito`);
  try {
    const cart = await cartManager.clearCart(cid);
    if (!cart) {
      console.log("Carrito no encontrado:", cid);
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    console.log("Carrito vaciado:", cart);
    res.json(cart);
  } catch (err) {
    console.error("Error al vaciar carrito:", err);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

export default router;
