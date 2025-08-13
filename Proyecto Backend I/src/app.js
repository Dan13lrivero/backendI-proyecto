import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

const productManager = new ProductManager('./src/data/products.json');

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine());
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

app.use('/api/products', productsRouter(io));
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