import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../services/productsApi'
import { getProductImage } from '../utils/productImage'

function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await getProductById(id)
        setProduct(response.data)
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'No se pudo cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0 text-primary">Detalle de producto</h1>
        <Link className="btn btn-outline-secondary" to="/productos">
          Volver
        </Link>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {!loading && product && (
        <div className="card pro-card">
          <button className="btn p-0 border-0 bg-transparent" onClick={() => setPreviewImage(getProductImage(product))}>
            <img
              src={getProductImage(product)}
              alt={product.nombre}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = 'https://placehold.co/640x420?text=Producto+deportivo'
              }}
              className="card-img-top"
              style={{
                maxHeight: '140px',
                objectFit: 'contain',
                objectPosition: 'center',
                background: '#f8f9fa',
                padding: '8px',
                imageRendering: 'pixelated',
              }}
            />
          </button>
          <div className="card-body">
            <h2 className="h5 mb-3 text-primary">{product.nombre}</h2>
            <p className="text-secondary mb-3">{product.descripcion}</p>

            <div className="row g-3 text-secondary-emphasis">
              <div className="col-md-4">
                <strong>Categoría:</strong> <span className="badge text-bg-info text-capitalize ms-1">{product.categoria}</span>
              </div>
              <div className="col-md-4">
                <strong>Precio:</strong>{' '}
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.precio)}
              </div>
              <div className="col-md-4">
                <strong>Stock:</strong> {product.stock}
              </div>
              <div className="col-md-4">
                <strong>Activo:</strong>{' '}
                <span className={`badge ${product.activo ? 'text-bg-success' : 'text-bg-secondary'}`}>
                  {product.activo ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="col-md-4">
                <strong>Fecha ingreso:</strong> {new Date(product.fechaIngreso).toLocaleDateString('es-ES')}
              </div>
              <div className="col-md-4">
                <strong>Actualizado:</strong> {new Date(product.updatedAt).toLocaleString('es-ES')}
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0">
            <Link className="btn btn-warning" to={`/productos/editar/${product._id}`}>
              Editar
            </Link>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.75)', zIndex: 2000 }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white p-2 rounded"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="d-flex justify-content-end mb-2 px-2">
              <button className="btn btn-sm btn-outline-dark" onClick={() => setPreviewImage(null)}>
                Cerrar
              </button>
            </div>
            <img src={previewImage} alt={product?.nombre || 'preview'} className="img-fluid rounded" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetailPage
