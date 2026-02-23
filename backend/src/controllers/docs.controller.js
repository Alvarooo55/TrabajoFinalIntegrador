const getDocumentation = (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Documentación de endpoints v1',
    data: {
      basePath: '/api/v1',
      endpoints: [
        {
          method: 'GET',
          path: '/documentacion',
          description: 'Devuelve documentación básica de la API'
        },
        {
          method: 'GET',
          path: '/productos/get/all',
          description: 'Lista productos con paginación y filtros',
          query: {
            page: 'number',
            limit: 'number',
            categoria: 'calzado|ropa|accesorios|equipamiento',
            activo: 'true|false',
            search: 'string'
          }
        },
        {
          method: 'GET',
          path: '/productos/get/:id',
          description: 'Obtiene un producto por ID'
        },
        {
          method: 'POST',
          path: '/productos/post',
          description: 'Crea un producto'
        },
        {
          method: 'PUT',
          path: '/productos/update/:id',
          description: 'Actualiza completamente un producto'
        },
        {
          method: 'PATCH',
          path: '/productos/update/:id',
          description: 'Actualiza parcialmente un producto'
        },
        {
          method: 'DELETE',
          path: '/productos/delete/:id',
          description: 'Elimina un producto'
        }
      ]
    }
  });
};

module.exports = {
  getDocumentation
};
