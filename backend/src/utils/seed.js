require('dotenv').config();

const mongoose = require('mongoose');
const { Product } = require('../models/product.model');

const products = [
  {
    nombre: 'Balón de Fútbol Pro Match',
    descripcion: 'Balón profesional de entrenamiento con costura reforzada para césped natural y sintético.',
    precio: 49.99,
    fechaIngreso: '2025-01-10',
    activo: true,
    categoria: 'equipamiento',
    stock: 35
  },
  {
    nombre: 'Guantes de Portero Elite',
    descripcion: 'Guantes con palma de látex y ajuste de muñeca para mayor control y seguridad.',
    precio: 39.5,
    fechaIngreso: '2025-02-18',
    activo: true,
    categoria: 'accesorios',
    stock: 20
  },
  {
    nombre: 'Zapatillas Running Velocity X',
    descripcion: 'Zapatillas ligeras para running con amortiguación de alto rendimiento.',
    precio: 89.99,
    fechaIngreso: '2025-03-03',
    activo: true,
    categoria: 'calzado',
    stock: 42
  },
  {
    nombre: 'Camiseta Técnica DryFit Azul',
    descripcion: 'Camiseta transpirable para entrenamiento diario con secado rápido.',
    precio: 24.99,
    fechaIngreso: '2025-01-25',
    activo: true,
    categoria: 'ropa',
    stock: 60
  },
  {
    nombre: 'Short Deportivo Flex',
    descripcion: 'Short elástico y cómodo para gimnasio, running y deportes de equipo.',
    precio: 19.99,
    fechaIngreso: '2025-01-30',
    activo: true,
    categoria: 'ropa',
    stock: 50
  },
  {
    nombre: 'Mancuernas Hexagonales 10kg',
    descripcion: 'Par de mancuernas recubiertas en goma con agarre ergonómico y antideslizante.',
    precio: 64.0,
    fechaIngreso: '2025-02-12',
    activo: true,
    categoria: 'equipamiento',
    stock: 15
  },
  {
    nombre: 'Mancuernas Hexagonales 5kg',
    descripcion: 'Par de mancuernas para tonificación y entrenamiento funcional.',
    precio: 39.0,
    fechaIngreso: '2025-02-12',
    activo: true,
    categoria: 'equipamiento',
    stock: 22
  },
  {
    nombre: 'Colchoneta Yoga Premium',
    descripcion: 'Colchoneta antideslizante con alta densidad para yoga, pilates y estiramientos.',
    precio: 29.99,
    fechaIngreso: '2025-03-15',
    activo: true,
    categoria: 'equipamiento',
    stock: 40
  },
  {
    nombre: 'Botella Térmica Sport 750ml',
    descripcion: 'Botella de acero inoxidable con aislamiento para mantener bebidas frías o calientes.',
    precio: 17.5,
    fechaIngreso: '2025-02-20',
    activo: true,
    categoria: 'accesorios',
    stock: 75
  },
  {
    nombre: 'Rodillera Compresión Pro',
    descripcion: 'Rodillera elástica para soporte articular durante ejercicio intenso.',
    precio: 15.99,
    fechaIngreso: '2025-02-27',
    activo: true,
    categoria: 'accesorios',
    stock: 48
  },
  {
    nombre: 'Muñequera Deportiva Par',
    descripcion: 'Muñequeras absorbentes para entrenamiento funcional y tenis.',
    precio: 9.99,
    fechaIngreso: '2025-03-05',
    activo: true,
    categoria: 'accesorios',
    stock: 90
  },
  {
    nombre: 'Calcetines Running Pack x3',
    descripcion: 'Pack de calcetines técnicos con refuerzo en talón y puntera.',
    precio: 12.99,
    fechaIngreso: '2025-02-01',
    activo: true,
    categoria: 'ropa',
    stock: 100
  },
  {
    nombre: 'Zapatillas Fútbol Sala Grip',
    descripcion: 'Calzado especializado para pista indoor con suela de alta tracción.',
    precio: 74.99,
    fechaIngreso: '2025-03-10',
    activo: true,
    categoria: 'calzado',
    stock: 28
  },
  {
    nombre: 'Sudadera Training Core',
    descripcion: 'Sudadera cómoda con capucha para entrenamiento y uso diario.',
    precio: 34.99,
    fechaIngreso: '2025-01-18',
    activo: true,
    categoria: 'ropa',
    stock: 33
  },
  {
    nombre: 'Banda Elástica Resistencia Media',
    descripcion: 'Banda de resistencia para ejercicios de movilidad y fuerza.',
    precio: 11.5,
    fechaIngreso: '2025-02-08',
    activo: true,
    categoria: 'equipamiento',
    stock: 67
  },
  {
    nombre: 'Comba Crossfit Speed Rope',
    descripcion: 'Comba de velocidad ajustable para entrenamiento cardiovascular.',
    precio: 21.0,
    fechaIngreso: '2025-01-22',
    activo: true,
    categoria: 'equipamiento',
    stock: 46
  },
  {
    nombre: 'Casaca Rompevientos Trail',
    descripcion: 'Casaca ligera cortavientos ideal para running en exteriores.',
    precio: 44.99,
    fechaIngreso: '2025-03-01',
    activo: true,
    categoria: 'ropa',
    stock: 25
  },
  {
    nombre: 'Gorra Deportiva UV',
    descripcion: 'Gorra transpirable con protección solar para entrenamientos al aire libre.',
    precio: 13.99,
    fechaIngreso: '2025-01-28',
    activo: true,
    categoria: 'accesorios',
    stock: 58
  },
  {
    nombre: 'Zapatillas Basketball Court Max',
    descripcion: 'Zapatillas de baloncesto con soporte de tobillo y suela de alto agarre.',
    precio: 99.0,
    fechaIngreso: '2025-03-20',
    activo: true,
    categoria: 'calzado',
    stock: 18
  },
  {
    nombre: 'Espinilleras Protección Total',
    descripcion: 'Espinilleras anatómicas ligeras para fútbol competitivo.',
    precio: 18.75,
    fechaIngreso: '2025-02-14',
    activo: true,
    categoria: 'accesorios',
    stock: 52
  },
  {
    nombre: 'Producto Descontinuado Demo',
    descripcion: 'Producto de ejemplo para probar regla de negocio de activo y stock.',
    precio: 20.0,
    fechaIngreso: '2025-01-05',
    activo: false,
    categoria: 'equipamiento',
    stock: 0
  }
];

const runSeed = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('Falta MONGODB_URI en .env');
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado para seed');

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Seed completado: ${products.length} productos insertados`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error.message);
    process.exit(1);
  }
};

runSeed();
