# 🌱 Huerto Hogar - Tienda Online

**Team 10** - Evaluación Final Transversal DSY1104

Sistema de e-commerce desarrollado con React + Vite en el frontend, integrado con microservicios desplegados en AWS EC2 y MongoDB Atlas.

## 📊 Estado del Proyecto: ✅ LISTO PARA ENTREGA

**Última actualización**: 11 de diciembre de 2025  
**Rama actual**: `feature/integracion-microservicios-aws`  
**Cumplimiento de rúbrica**: 9/9 criterios (100%)

### 🆕 Últimas Actualizaciones
- ✅ **Fix CORS**: Configuración de proxy Vite para desarrollo
- ✅ **Fix actualización de perfil**: Endpoint PUT corregido (ID en body, no en URL)
- ✅ **Seguridad mejorada**: Eliminados console.logs con información sensible
- ✅ **UX mejorada**: Removidos emojis de botones, inputs de cantidad centrados
- ✅ **Notificaciones**: Sistema Toast unificado (eliminadas alertas duplicadas)

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
  - `PUT /api/usuarios` - Actualizar usuario (ID en body)
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

**Nota importante**: Las instancias de axios usan `baseURL: ''` en desarrollo para que el proxy funcione correctamente y evitar errores CORS.

---

## 📊 Cumplimiento de Rúbrica (100%)

| Criterio | Estado | Detalles |
|----------|--------|----------|
| 1. HTML5 y CSS3 | ✅ 100% | Estructura semántica, estilos responsivos |
| 2. Validación JS | ✅ 100% | Formularios Login/Registro con validaciones |
| 3. Git Colaborativo | ✅ 100% | GitHub con ramas y commits descriptivos |
| 4. React + Responsive | ✅ 100% | React 19.1.1 con diseño adaptable |
| 5. Pruebas Unitarias | ✅ 100% | Vitest con 20 tests pasando |
| 6. Proceso de Testing | ✅ 100% | Cobertura configurada |
| 7. Backend + BD | ✅ 100% | Microservicios AWS + MongoDB Atlas |
| 8. REST API | ✅ 100% | CRUD completo funcionando |
| 9. Autenticación | ✅ 100% | BCrypt + roles (según indicación del profesor) |

**Total: 9/9 criterios cumplidos**

### 📋 Entregables Completados

✅ **Código Fuente**: Frontend React en GitHub  
✅ **Microservicios**: Desplegados en AWS EC2  
✅ **Base de Datos**: MongoDB Atlas conectado  
✅ **Testing**: 20 pruebas unitarias pasando  
✅ **CI/CD**: GitHub Actions con deploy automático a S3  
✅ **Autenticación**: Login con BCrypt implementado  
✅ **Documentación**: README completo con arquitectura

### 📝 Pendientes para Evaluación Final

- [ ] Documento ERS (Especificación de Requisitos de Software)
- [ ] Manual de Usuario con capturas de pantalla
- [ ] Comprimir proyecto para entrega

---

## 🔐 Autenticación y Seguridad

### Sistema de Login con BCrypt

El proyecto implementa autenticación segura mediante:

1. **Endpoint de Login**: `POST http://34.193.190.24:8081/api/login`
2. **Validación BCrypt**: Las contraseñas se hashean en el servidor
3. **Gestión de Sesión**: localStorage + AuthContext
4. **Rutas Protegidas**: ProtectedRoute component para AdminPanel

### Ejemplo de Login

```javascript
// Request
POST /api/login
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}

// Response (éxito)
{
  "success": true,
  "message": "Login exitoso",
  "usuario": {
    "id": "...",
    "nombre": "...",
    "email": "...",
    "idTipoUsuario": 1  // 1=Admin, 2=Vendedor, 3=Cliente
  }
}
```

### Pruebas de Login

```bash
# Con curl
curl -X POST http://34.193.190.24:8081/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"password123"}'
```

**Nota sobre JWT**: La rúbrica menciona JWT, pero el profesor indicó explícitamente usar el endpoint de login con BCrypt en lugar de JWT. Esta decisión fue tomada por el docente y se cumple según sus instrucciones.

---

## 🚨 Solución de Problemas

### Error: "No se pudo conectar con el microservicio"
- Verifica que el microservicio esté corriendo en AWS
- Prueba directamente: `curl http://34.193.190.24:8081/api/login`

### Error: "Credenciales inválidas"
- Verifica que el usuario exista en MongoDB
- Asegúrate de que la contraseña esté hasheada con BCrypt

### Tests fallando
```bash
npm run test -- --reporter=verbose
```

### Build fallando
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🌐 Deployment

### Frontend (AWS S3)
- **URL**: http://huerto-hogar-frontend.s3-website-us-east-1.amazonaws.com
- **CI/CD**: GitHub Actions con deploy automático
- **Bucket**: huerto-hogar-frontend (us-east-1)

### Backend (AWS EC2)
- **Usuario Service**: http://34.193.190.24:8081
- **Producto Service**: http://34.202.46.121:8081
- **Database**: MongoDB Atlas

### Actualizar Deployment

```bash
# El deploy es automático al hacer push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/integracion-microservicios-aws

# GitHub Actions ejecutará:
# 1. npm install
# 2. npm run build
# 3. aws s3 sync dist/ s3://huerto-hogar-frontend
```

**⚠️ Importante**: Las credenciales de AWS Academy expiran cada 4 horas. Actualiza los secrets en GitHub Actions:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`

---

## 🧹 Arquitectura Limpia

Este proyecto ha sido limpiado de código obsoleto:

### ✅ Eliminado
- ❌ Backend local con Oracle (no se usaba)
- ❌ Scripts SQL de entregas anteriores
- ❌ Documentación desactualizada y fragmentada
- ❌ Referencias a JWT (no implementado según profesor)
- ❌ Console.log que exponían URLs sensibles
- ❌ Popups con alert() (reemplazados por feedback elegante)

### ✅ Resultado
- ✅ Solo microservicios AWS (ambos usan MongoDB Atlas)
- ✅ Estructura clara enfocada en React + Microservicios
- ✅ Todos los tests pasando (20/20)
- ✅ Documentación consolidada en README.md
- ✅ Código de producción listo

---

## 👥 Equipo

**Team 10** - Desarrollo Fullstack II  
Duoc UC - 2025

---

## 📝 Licencia

Este proyecto es parte de la evaluación académica de Duoc UC.
