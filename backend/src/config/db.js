const mongoose = require('mongoose');

const connectDB = async ({ exitOnError = true } = {}) => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Falta la variable MONGODB_URI en el archivo .env');
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    if (exitOnError) {
      process.exit(1);
    }

    throw error;
  }
};

module.exports = connectDB;
