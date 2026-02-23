const mongoose = require('mongoose');

const ALLOWED_CATEGORIES = ['calzado', 'ropa', 'accesorios', 'equipamiento'];

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
      maxlength: [120, 'El nombre no debe superar 120 caracteres']
    },
    nombreNormalizado: {
      type: String,
      unique: true,
      index: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [10, 'La descripción debe tener mínimo 10 caracteres'],
      maxlength: [500, 'La descripción no debe superar 500 caracteres']
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [1, 'El precio mínimo es 1'],
      max: [10000, 'El precio máximo es 10000']
    },
    fechaIngreso: {
      type: Date,
      required: [true, 'La fecha de ingreso es obligatoria']
    },
    activo: {
      type: Boolean,
      required: true,
      default: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: 'Categoría inválida'
      }
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: 'El stock debe ser un número entero'
      }
    }
  },
  {
    timestamps: true
  }
);

productSchema.pre('validate', function normalizeName(next) {
  if (this.nombre) {
    this.nombreNormalizado = this.nombre.trim().toLowerCase();
  }
  next();
});

productSchema.pre('save', function validateBusinessRules(next) {
  if (this.activo === false && this.stock > 0) {
    return next(new Error('Un producto inactivo debe tener stock igual a 0'));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
  ALLOWED_CATEGORIES
};
