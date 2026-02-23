const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./src/routes/product.routes');
const docsRoutes = require('./src/routes/docs.routes');
const notFound = require('./src/middlewares/notFound.middleware');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API SportStock activa'
  });
});

app.use('/api/v1/documentacion', docsRoutes);
app.use('/api/v1/productos', productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
