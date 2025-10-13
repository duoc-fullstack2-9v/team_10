import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Registro from './pages/Registro'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import ReportesAdmin from './pages/ReportesAdmin'
import './App.css'


function Nosotros() {
  return (
    <main className="main">
      <div style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h1>Nosotros</h1>
        <p>Página sobre nosotros - En construcción</p>
      </div>
    </main>
  )
}

function Blogs() {
  return (
    <main className="main">
      <div style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h1>Blogs</h1>
        <p>Página de blogs - En construcción</p>
      </div>
    </main>
  )
}

function Contacto() {
  return (
    <main className="main">
      <div style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h1>Contacto</h1>
        <p>Página de contacto - En construcción</p>
      </div>
    </main>
  )
}

function Carrito() {
  return (
    <main className="main">
      <div style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h1>Carrito de Compras</h1>
        <p>Página del carrito - En construcción</p>
      </div>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blogs" element={<Blogs />} />
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
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
