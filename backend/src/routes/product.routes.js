const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/get/all', asyncHandler(getAllProducts));
router.get('/get/:id', asyncHandler(getProductById));
router.post('/post', asyncHandler(createProduct));
router.put('/update/:id', asyncHandler(updateProduct));
router.patch('/update/:id', asyncHandler(updateProduct));
router.delete('/delete/:id', asyncHandler(deleteProduct));

module.exports = router;
