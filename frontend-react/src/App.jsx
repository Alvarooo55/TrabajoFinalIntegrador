import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductFormPage from './pages/ProductFormPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/productos">
            SportStock React
          </Link>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/productos" element={<ProductListPage />} />
          <Route path="/productos/nuevo" element={<ProductFormPage />} />
          <Route path="/productos/editar/:id" element={<ProductFormPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
