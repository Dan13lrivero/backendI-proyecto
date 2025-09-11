import { Router } from 'express';
import Product from '../managers/ProductManager.js'; // O el modelo que uses

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    let filter = {};

    if (query) {
      const [key, value] = query.split(':');
      if (key && value) filter[key] = value;
    }

    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.max(1, parseInt(page));

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((currentPage - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const nextPage = hasNextPage ? currentPage + 1 : null;

    const buildLink = (p) =>
      p ? `/api/products?limit=${limit}&page=${p}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: buildLink(prevPage),
      nextLink: buildLink(nextPage),
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

export default router;  