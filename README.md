# 🌱 Huerto Hogar - Tienda Online

**Team 10** - Evaluación Final Transversal DSY1104

Sistema de e-commerce desarrollado con React + Vite en el frontend, integrado con microservicios desplegados en AWS y MongoDB Atlas.

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────┐
│   Frontend React    │
│   (Este Repositorio)│
│   localhost:5173    │
└──────────┬──────────┘
           │
           │ REST API
           │
    ┌──────┴───────┐
    │              │
┌───▼────┐    ┌───▼────┐
│Usuario │    │Producto│
│Service │    │Service │
│AWS EC2 │    │AWS EC2 │
└───┬────┘    └───┬────┘
    │              │
    └──────┬───────┘
           │
    ┌──────▼──────┐
    │  MongoDB    │
    │   Atlas     │
    └─────────────┘
```

---

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 24.x o superior
- npm 11.x o superior
- Conexión a Internet (para microservicios AWS)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/duoc-fullstack2-9v/team_10.git
cd team_10

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
team_10/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── Nav.jsx          # Barra de navegación
│   │   ├── Footer.jsx       # Pie de página
│   │   ├── ProductCard.jsx  # Tarjeta de producto
│   │   └── ProtectedRoute.jsx # Protección de rutas
│   ├── pages/               # Páginas principales
│   │   ├── Home.jsx         # Página de inicio
│   │   ├── Login.jsx        # Página de login
│   │   ├── Registro.jsx     # Registro de usuarios
│   │   ├── Productos.jsx    # Catálogo de productos
│   │   └── AdminPanel.jsx   # Panel de administración
│   ├── services/            # Servicios para APIs
│   │   ├── usuario.service.js
│   │   ├── producto.service.js
│   │   └── axios.config.js
│   ├── contexts/            # Context API
│   │   └── AuthContext.jsx  # Gestión de autenticación
│   ├── config/              # Configuraciones
│   │   └── api.config.js    # URLs de microservicios
│   └── assets/              # Recursos estáticos
├── tests/                   # Pruebas unitarias
└── public/                  # Archivos públicos
```

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Framework de UI
- **Vite 7.1.9** - Build tool y dev server
- **React Router 7.9.3** - Enrutamiento
- **Axios 1.13.2** - Cliente HTTP
- **Vitest 3.2.4** - Testing framework
- **Testing Library** - Pruebas de componentes

### Backend (Microservicios AWS)
- **Spring Boot** - Framework backend
- **MongoDB Atlas** - Base de datos NoSQL
- **BCrypt** - Hash de contraseñas
- **AWS EC2** - Hosting de microservicios

---

## 🌐 Microservicios

### Servicio de Usuarios
- **URL**: `http://34.193.190.24:8081`
- **Endpoints**:
  - `POST /api/login` - Autenticación con BCrypt
  - `GET /api/usuarios` - Listar usuarios
  - `POST /api/usuarios` - Registrar usuario
  - `PUT /api/usuarios/{id}` - Actualizar usuario
  - `DELETE /api/usuarios/{id}` - Eliminar usuario

### Servicio de Productos
- **URL**: `http://34.202.46.121:8081`
- **Endpoints**:
  - `GET /api/productos` - Listar productos
  - `GET /api/productos/{id}` - Obtener producto
  - `POST /api/productos` - Crear producto
  - `PUT /api/productos/{id}` - Actualizar producto
  - `DELETE /api/productos/{id}` - Eliminar producto

---

## 🔐 Autenticación

El sistema utiliza autenticación mediante endpoint de login con BCrypt:

```javascript
// Login
POST /api/login
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}

// Response
{
  "success": true,
  "message": "Login exitoso",
  "id": "...",
  "nombre": "...",
  "email": "...",
  "idTipoUsuario": 1
}
```

### Roles de Usuario
- **Tipo 1**: Administrador (acceso completo)
- **Tipo 2**: Vendedor (gestión de productos)
- **Tipo 3**: Cliente (compras)

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Con cobertura
npm run test:coverage

# Interfaz de pruebas
npm run test:ui
```

### Cobertura Actual
- Componentes principales cubiertos
- Validaciones de formularios
- Navegación y rutas
- Renderizado de componentes

---

## 📜 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run test         # Ejecutar pruebas
npm run test:coverage # Cobertura de pruebas
```

---

## 🔄 Proxy de Desarrollo

El proyecto usa proxy de Vite para desarrollo local (configurado en `vite.config.js`):

```javascript
proxy: {
  '/api/login': {
    target: 'http://34.193.190.24:8081',
    changeOrigin: true
  },
  '/api/usuarios': {
    target: 'http://34.193.190.24:8081',
    changeOrigin: true
  },
  '/api/productos': {
    target: 'http://34.202.46.121:8081',
    changeOrigin: true
  }
}
```

---

## 📚 Documentación

### Documentos Principales

- **[CUMPLIMIENTO_RUBRICA.md](./CUMPLIMIENTO_RUBRICA.md)** 
  - ✅ Verificación completa de todos los criterios de evaluación
  - ✅ Justificación de decisiones técnicas (por qué no JWT, etc.)
  - ✅ Lista de entregables completos y pendientes
  - ✅ Próximos pasos para finalizar evaluación

- **[GUIA_LOGIN_MICROSERVICIOS.md](./GUIA_LOGIN_MICROSERVICIOS.md)**
  - 🔐 Integración de autenticación con BCrypt
  - 🌐 Endpoints de microservicios documentados
  - 🧪 Guía de pruebas y troubleshooting
  - 📡 Arquitectura de comunicación frontend-backend

---

## 👥 Equipo

**Team 10** - Desarrollo Fullstack II  
Duoc UC - 2025

---

## 📝 Licencia

Este proyecto es parte de la evaluación académica de Duoc UC.

---

**Última actualización**: 29 de noviembre de 2025  
**Rama actual**: `feature/integracion-microservicios-aws`
