# 📚 Guía de Uso de Servicios AWS - MongoDB

## ✅ Lo que ya está creado

1. **Configuración de API** (`src/config/api.config.js`)
   - URLs de microservicios Usuario y Producto
   - Endpoints definidos
   - Configuración de timeouts y headers

2. **Instancias de Axios** (`src/services/axios.config.js`)
   - Interceptores para agregar token automáticamente
   - Manejo de errores 401 (redirección a login)
   - Logging de peticiones y respuestas

3. **Servicios completos**:
   - `usuario.service.js` - Login, registro, CRUD de usuarios
   - `producto.service.js` - CRUD completo de productos

4. **Custom Hook** (`src/hooks/useProductos.js`)
   - Manejo de estado de productos
   - Estados de loading y error
   - Funciones de búsqueda y filtrado

---

## 🚀 Cómo usar los servicios

### 1️⃣ Servicio de Usuarios (UsuarioService)

#### Login de usuario
```javascript
import UsuarioService from '../services/usuario.service';

// En tu componente de Login
const handleLogin = async (email, password) => {
  try {
    const response = await UsuarioService.login({ email, password });
    console.log('Usuario logueado:', response.usuario);
    console.log('Token:', response.token);
    // El token ya se guarda automáticamente en localStorage
  } catch (error) {
    console.error('Error en login:', error.message);
  }
};
```

#### Registro de usuario
```javascript
const handleRegistro = async (datos) => {
  try {
    const nuevoUsuario = await UsuarioService.registrar({
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password,
      rol: 'cliente' // 'admin' o 'cliente'
    });
    console.log('Usuario registrado:', nuevoUsuario);
  } catch (error) {
    console.error('Error en registro:', error.message);
  }
};
```

#### Obtener usuario actual
```javascript
const cargarUsuario = async (id) => {
  try {
    const usuario = await UsuarioService.obtenerUsuario(id);
    console.log('Usuario:', usuario);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### Listar todos los usuarios (solo admin)
```javascript
const cargarUsuarios = async () => {
  try {
    const usuarios = await UsuarioService.listarUsuarios();
    console.log('Usuarios:', usuarios);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

### 2️⃣ Servicio de Productos (ProductoService)

#### Listar todos los productos
```javascript
import ProductoService from '../services/producto.service';

const cargarProductos = async () => {
  try {
    const productos = await ProductoService.listarProductos();
    console.log('Productos:', productos);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### Buscar productos
```javascript
const buscar = async (termino) => {
  try {
    const resultados = await ProductoService.buscarProductos(termino);
    console.log('Resultados:', resultados);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### Filtrar por categoría
```javascript
const filtrar = async (categoria) => {
  try {
    const productos = await ProductoService.obtenerPorCategoria(categoria);
    console.log('Productos de', categoria, ':', productos);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### Crear producto (admin)
```javascript
const crearProducto = async (datos) => {
  try {
    const nuevoProducto = await ProductoService.crearProducto({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      stock: datos.stock,
      categoria: datos.categoria,
      imagen: datos.imagen
    });
    console.log('Producto creado:', nuevoProducto);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### Actualizar stock
```javascript
const actualizarStock = async (id, cantidad) => {
  try {
    const producto = await ProductoService.actualizarStock(id, cantidad);
    console.log('Stock actualizado:', producto);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

### 3️⃣ Usando el Custom Hook (useProductos)

```javascript
import { useProductos } from '../hooks/useProductos';

function MiComponente() {
  const { 
    productos,       // Array de productos
    loading,         // true mientras carga
    error,          // Mensaje de error si hay
    buscarProductos,        // Función para buscar
    filtrarPorCategoria    // Función para filtrar
  } = useProductos();

  // Los productos se cargan automáticamente al montar el componente

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      
      {productos.map(p => (
        <div key={p.id}>{p.nombre} - ${p.precio}</div>
      ))}

      <button onClick={() => buscarProductos('tomate')}>
        Buscar Tomate
      </button>

      <button onClick={() => filtrarPorCategoria('Verduras')}>
        Ver Verduras
      </button>
    </div>
  );
}
```

---

## 🔐 Manejo de Autenticación

El token se maneja **automáticamente**:

1. **Al hacer login**, el token se guarda en `localStorage`
2. **En cada petición**, el interceptor de Axios agrega el token al header:
   ```
   Authorization: Bearer <tu-token>
   ```
3. **Si el token expira** (error 401), el usuario es redirigido a `/login`

### Verificar si hay usuario logueado
```javascript
const token = localStorage.getItem('token');
if (token) {
  console.log('Usuario logueado');
} else {
  console.log('No hay sesión');
}
```

### Logout
```javascript
UsuarioService.logout(); // Limpia el localStorage
window.location.href = '/login'; // Redirige al login
```

---

## 📂 Estructura de archivos creados

```
src/
  ├── config/
  │   └── api.config.js          # URLs y endpoints
  ├── services/
  │   ├── axios.config.js        # Instancias de Axios
  │   ├── usuario.service.js     # Servicio de usuarios
  │   └── producto.service.js    # Servicio de productos
  ├── hooks/
  │   └── useProductos.js        # Hook personalizado
  ├── components/
  │   └── ProductosEjemplo.jsx   # Componente de ejemplo
  └── examples/
      └── uso-servicios.md       # Esta guía
```

---

## ⚠️ Siguientes pasos

1. **Actualizar AuthContext** para usar `UsuarioService`
2. **Actualizar componentes existentes**:
   - `src/pages/Productos.jsx` → usar `useProductos`
   - `src/pages/Login.jsx` → usar `UsuarioService.login()`
   - `src/pages/Registro.jsx` → usar `UsuarioService.registrar()`
3. **Probar la conexión** con los microservicios AWS
4. **Manejar CORS** si es necesario (configurar en backend)

---

## 🐛 Debugging

### Ver peticiones en consola
Las peticiones se loguean automáticamente. Verás:
```
[Axios Request] GET http://34.202.46.121:8081/api/productos
[Axios Response] 200 {...datos...}
```

### Errores comunes

1. **Error 401**: Token expirado o inválido → Se redirige a login automáticamente
2. **Error CORS**: Configurar backend para aceptar peticiones desde el frontend
3. **Error 404**: Endpoint incorrecto → Verificar URLs en `api.config.js`
4. **Network Error**: Microservicio caído → Verificar que las IPs estén activas

---

## 📞 Endpoints disponibles

### Usuario Microservice (34.193.190.24:8081)
- POST `/api/usuarios/login`
- POST `/api/usuarios/registrar`
- GET `/api/usuarios`
- GET `/api/usuarios/{id}`
- PUT `/api/usuarios/{id}`
- DELETE `/api/usuarios/{id}`

### Producto Microservice (34.202.46.121:8081)
- GET `/api/productos`
- GET `/api/productos/{id}`
- POST `/api/productos`
- PUT `/api/productos/{id}`
- DELETE `/api/productos/{id}`
- GET `/api/productos/buscar?q={termino}`
- GET `/api/productos/categoria/{categoria}`
- PATCH `/api/productos/{id}/stock?cantidad={cantidad}`

---

✅ **¡Todo listo para integrar el frontend con los microservicios AWS!** 🚀
