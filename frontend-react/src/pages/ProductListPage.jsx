import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, getProducts } from '../services/productsApi'
import { getProductImage } from '../utils/productImage'

function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [previewTitle, setPreviewTitle] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [categoria, setCategoria] = useState('')
  const [activo, setActivo] = useState('')
  const [search, setSearch] = useState('')

  const fetchProducts = useCallback(async (targetPage = 1, filters = {}) => {
    const categoriaFilter = filters.categoria ?? categoria
    const activoFilter = filters.activo ?? activo
    const searchFilter = filters.search ?? search

    setLoading(true)
    setErrorMessage('')

    try {
      const response = await getProducts({
        page: targetPage,
        limit,
        categoria: categoriaFilter,
        activo: activoFilter,
        search: searchFilter,
      })

      setProducts(response.data)
      setTotal(response.meta.total)
      setTotalPages(Math.max(1, Math.ceil(response.meta.total / limit)))
      setPage(response.meta.page)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'No se pudieron obtener los productos')
    } finally {
      setLoading(false)
    }
  }, [activo, categoria, limit, search])

  useEffect(() => {
    fetchProducts(1)
  }, [fetchProducts])

  const onFilter = () => {
    fetchProducts(1)
  }

  const onClear = () => {
    setCategoria('')
    setActivo('')
    setSearch('')
    fetchProducts(1, { categoria: '', activo: '', search: '' })
  }

  const onDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este producto?')
    if (!confirmed) return

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await deleteProduct(id)
      setSuccessMessage(response.message || 'Producto eliminado correctamente')
      await fetchProducts(page)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'No se pudo eliminar el producto')
      setLoading(false)
    }
  }

  const openPreview = (image, title) => {
    setPreviewImage(image)
    setPreviewTitle(title)
  }

  const closePreview = () => {
    setPreviewImage(null)
    setPreviewTitle('')
  }

  return (
    <>
      <section className="hero-block mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="h3 mb-1">Catálogo SportStock</h1>
            <p className="hero-subtitle">Gestión inteligente de productos deportivos con control de stock y estado en tiempo real.</p>
          </div>
          <Link className="btn btn-light fw-semibold" to="/productos/nuevo">
            + Nuevo producto
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <span className="metric-chip">Registros: {total}</span>
          <span className="metric-chip">Páginas: {totalPages}</span>
          <span className="metric-chip">Página actual: {page}</span>
        </div>
      </section>

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0 text-primary">Productos</h2>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card pro-card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del producto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Categoría</label>
              <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                <option value="calzado">Calzado</option>
                <option value="ropa">Ropa</option>
                <option value="accesorios">Accesorios</option>
                <option value="equipamiento">Equipamiento</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Activo</label>
              <select className="form-select" value={activo} onChange={(e) => setActivo(e.target.value)}>
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-outline-primary w-100" onClick={onFilter}>
                Filtrar
              </button>
              <button className="btn btn-outline-dark w-100" onClick={onClear}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div className="card pro-card">
          <div className="card-body">
            <div className="row g-3">
              {products.map((product) => (
                <div className="col-md-6 col-xl-4" key={product._id}>
                  <div className="card h-100 product-card">
                    <button
                      className="btn p-0 border-0 bg-transparent"
                      onClick={() => openPreview(getProductImage(product), product.nombre)}
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.nombre}
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = 'https://placehold.co/640x420?text=Producto+deportivo'
                        }}
                        className="card-img-top"
                        style={{
                          height: '90px',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          background: '#f8f9fa',
                          padding: '6px',
                          imageRendering: 'pixelated',
                        }}
                      />
                    </button>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h5 className="card-title mb-0 text-primary">{product.nombre}</h5>
                        <span className={`badge ${product.activo ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {product.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div className="mb-3 d-flex flex-wrap gap-2">
                        <span className="badge text-bg-info text-capitalize">{product.categoria}</span>
                        <span className="badge text-bg-light border">Stock: {product.stock}</span>
                      </div>

                      <p className="card-text price-tag mb-3">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.precio)}
                      </p>

                      <div className="mt-auto d-flex gap-2">
                        <Link className="btn btn-sm btn-outline-info w-100" to={`/productos/${product._id}`}>
                          Ver
                        </Link>
                        <Link className="btn btn-sm btn-outline-warning w-100" to={`/productos/editar/${product._id}`}>
                          Editar
                        </Link>
                        <button className="btn btn-sm btn-outline-danger w-100" onClick={() => onDelete(product._id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="col-12">
                  <div className="text-center py-4">No hay productos para mostrar.</div>
                </div>
              )}
            </div>
          </div>

          <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
            <small className="text-secondary fw-semibold">
              Registros: {total} | Páginas: {totalPages} | Página actual: {page}
            </small>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => fetchProducts(page - 1)}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => fetchProducts(page + 1)}
                disabled={page >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.75)', zIndex: 2000 }}
          onClick={closePreview}
        >
          <div
            className="bg-white p-2 rounded"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 px-2">
              <strong>{previewTitle}</strong>
              <button className="btn btn-sm btn-outline-dark" onClick={closePreview}>
                Cerrar
              </button>
            </div>
            <img src={previewImage} alt={previewTitle} className="img-fluid rounded" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  )
}

export default ProductListPage
