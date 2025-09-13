import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    let filter = {};
    if (query) {
      const [key, value] = query.split(':');
      if (key === 'status') {
        filter.stock = value === 'true' ? { $gt: 0 } : { $lte: 0 };
      } else if (key && value) {
        filter[key] = value;
      }
    }

    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.max(1, page);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const nextPage = hasNextPage ? currentPage + 1 : null;

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const queryParams = [];
    if (limit) queryParams.push(`limit=${limit}`);
    if (sort) queryParams.push(`sort=${sort}`);
    if (query) queryParams.push(`query=${query}`);
    const prevLink = hasPrevPage ? `${baseUrl}?${queryParams.join('&')}&page=${prevPage}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?${queryParams.join('&')}&page=${nextPage}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
