import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: `${apiBaseUrl}/productos`,
})

export const getProducts = async ({ page = 1, limit = 10, categoria = '', activo = '', search = '' }) => {
  const params = { page, limit }

  if (categoria) params.categoria = categoria
  if (activo === 'true' || activo === 'false') params.activo = activo
  if (search?.trim()) params.search = search.trim()

  const { data } = await api.get('/get/all', { params })
  return data
}

export const getProductById = async (id) => {
  const { data } = await api.get(`/get/${id}`)
  return data
}

export const createProduct = async (payload) => {
  const { data } = await api.post('/post', payload)
  return data
}

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/update/${id}`, payload)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/delete/${id}`)
  return data
}
