import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoSingle from './pages/ProductoSingle'
import Registro from './pages/Registro'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import ReportesAdmin from './pages/ReportesAdmin'
import TestAdmin from './pages/TestAdmin'
import Nosotros from './pages/Nosotros'
import Blog from './pages/Blog'
import Contacto from './pages/Contacto'
import Carrito from './pages/Carrito'

import './App.css'
// Corrección inteligente para macOS (solo cuando es necesario)
import './assets/smart-compatibility.css'
import './assets/smart-theme.js'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<ProductoSingle />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={<Carrito />} />
            
            {/* Rutas protegidas para administradores */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reportes" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ReportesAdmin />
                </ProtectedRoute>
              } 
            />
            {/* Ruta de prueba para debug */}
            <Route 
              path="/test-admin" 
              element={<TestAdmin />} 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
