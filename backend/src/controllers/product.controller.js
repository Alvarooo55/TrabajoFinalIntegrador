const { Product, ALLOWED_CATEGORIES } = require('../models/product.model');

const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const getAllProducts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.categoria) {
    if (!ALLOWED_CATEGORIES.includes(req.query.categoria)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida para el filtro'
      });
    }
    filters.categoria = req.query.categoria;
  }

  const activeFilter = parseBoolean(req.query.activo);
  if (typeof activeFilter === 'boolean') {
    filters.activo = activeFilter;
  }

  if (req.query.search) {
    filters.nombre = { $regex: req.query.search, $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Product.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filters)
  ]);

  return res.status(200).json({
    success: true,
    message: 'Productos obtenidos correctamente',
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró el producto'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Producto encontrado',
    data: product
  });
};

const createProduct = async (req, res) => {
  const payload = { ...req.body };

  const product = await Product.create(payload);

  return res.status(201).json({
    success: true,
    message: 'Producto creado correctamente',
    data: product
  });
};

const updateProduct = async (req, res) => {
  const existing = await Product.findById(req.params.id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró el producto'
    });
  }

  const payload = { ...req.body };

  if (typeof payload.nombre === 'string') {
    payload.nombreNormalizado = payload.nombre.trim().toLowerCase();
  }

  const nextActivo =
    typeof payload.activo === 'boolean' ? payload.activo : existing.activo;
  const nextStock =
    payload.stock !== undefined ? Number(payload.stock) : existing.stock;

  if (nextActivo === false && nextStock > 0) {
    return res.status(400).json({
      success: false,
      message: 'Un producto inactivo debe tener stock igual a 0'
    });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({
    success: true,
    message: 'Producto actualizado correctamente',
    data: updated
  });
};

const deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró el producto'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Producto eliminado correctamente'
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
