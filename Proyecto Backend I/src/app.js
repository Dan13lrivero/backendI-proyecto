import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

await mongoose.connect(
  "mongodb+srv://Dan13lrivero:permanganimetria@dbcoderhouse.alcn8yk.mongodb.net/?retryWrites=true&w=majority&appName=dbcoderhouse"
);

const productManager = new ProductManager();
const cartManager = new CartManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine());
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/products', (req, res) => {
  res.render('products');
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

app.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.render('cart', { cart: { _id: cid, products: [] } });
    res.render('cart', { cart });
  } catch {
    res.status(500).send('Error al cargar el carrito');
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.json({ _id: cid, products: [] });
    res.json(cart);
  } catch {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', async (socket) => {
  const products = await productManager.getProducts();
  socket.emit('updateProducts', products);

  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('updateProducts', updatedProducts);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
