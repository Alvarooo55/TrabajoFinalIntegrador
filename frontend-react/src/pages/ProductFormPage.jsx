import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProductById, updateProduct } from '../services/productsApi'

const initialForm = {
  nombre: '',
  descripcion: '',
  precio: 1,
  fechaIngreso: '',
  activo: true,
  categoria: '',
  stock: 0,
}

const categories = ['calzado', 'ropa', 'accesorios', 'equipamiento']

function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = useMemo(() => Boolean(id), [id])

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [touched, setTouched] = useState({})

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      setLoading(true)
      setErrorMessage('')
      try {
        const response = await getProductById(id)
        const product = response.data

        setForm({
          nombre: product.nombre ?? '',
          descripcion: product.descripcion ?? '',
          precio: product.precio ?? 1,
          fechaIngreso: product.fechaIngreso ? product.fechaIngreso.slice(0, 10) : '',
          activo: Boolean(product.activo),
          categoria: product.categoria ?? '',
          stock: product.stock ?? 0,
        })
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'No se pudo cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const errors = {
    nombre: !form.nombre || form.nombre.trim().length < 3 || form.nombre.trim().length > 120,
    descripcion:
      !form.descripcion || form.descripcion.trim().length < 10 || form.descripcion.trim().length > 500,
    precio: Number(form.precio) < 1 || Number(form.precio) > 10000,
    fechaIngreso: !form.fechaIngreso,
    categoria: !form.categoria,
    stock: !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0,
    estadoStock: !form.activo && Number(form.stock) > 0,
  }

  const isFormValid = !Object.values(errors).some(Boolean)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setTouched({
      nombre: true,
      descripcion: true,
      precio: true,
      fechaIngreso: true,
      categoria: true,
      stock: true,
      estadoStock: true,
    })

    if (!isFormValid) {
      return
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const payload = {
        ...form,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      }

      const response = isEditMode ? await updateProduct(id, payload) : await createProduct(payload)

      setSuccessMessage(response.message || 'Operación realizada correctamente')
      setTimeout(() => navigate('/productos'), 600)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'No se pudo guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0 text-primary">{isEditMode ? 'Editar producto' : 'Crear producto'}</h1>
        <Link className="btn btn-outline-secondary" to="/productos">
          Volver
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {!loading && (
        <form className="card pro-card" onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, nombre: true }))}
                />
                {touched.nombre && errors.nombre && (
                  <div className="text-danger small">Nombre requerido (3 a 120 caracteres)</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, categoria: true }))}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {touched.categoria && errors.categoria && <div className="text-danger small">Categoría requerida</div>}
              </div>

              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, descripcion: true }))}
                />
                {touched.descripcion && errors.descripcion && (
                  <div className="text-danger small">Descripción requerida (10 a 500 caracteres)</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Precio</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  max="10000"
                  step="0.01"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, precio: true }))}
                />
                {touched.precio && errors.precio && <div className="text-danger small">Precio entre 1 y 10000</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Fecha de ingreso</label>
                <input
                  className="form-control"
                  type="date"
                  name="fechaIngreso"
                  value={form.fechaIngreso}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, fechaIngreso: true }))}
                />
                {touched.fechaIngreso && errors.fechaIngreso && <div className="text-danger small">Fecha requerida</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Stock</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  onBlur={() => setTouched((p) => ({ ...p, stock: true }))}
                />
                {touched.stock && errors.stock && <div className="text-danger small">Stock entero mayor o igual a 0</div>}
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                    onBlur={() => setTouched((p) => ({ ...p, estadoStock: true }))}
                  />
                  <label className="form-check-label" htmlFor="activo">
                    Producto activo
                  </label>
                </div>
                {touched.estadoStock && errors.estadoStock && (
                  <div className="text-danger small mt-1">Si el producto está inactivo, el stock debe ser 0</div>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
            <Link className="btn btn-outline-secondary" to="/productos">
              Cancelar
            </Link>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default ProductFormPage
