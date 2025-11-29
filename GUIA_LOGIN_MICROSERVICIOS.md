# 🔐 Integración de Login con BCrypt - Microservicio de Usuarios

## 📋 Resumen

Este proyecto es un **frontend React** que se conecta a **microservicios independientes** en AWS:

- **Microservicio de Usuarios**: `http://34.193.190.24:8081`
- **Microservicio de Productos**: `http://34.202.46.121:8081`
- **Base de Datos**: MongoDB Atlas

## ✅ Cambios Realizados en el Frontend

### Archivo Actualizado: `src/services/usuario.service.js`

El servicio de login ahora usa el endpoint `/api/login` del microservicio que implementa validación con BCrypt.

**Antes** (inseguro):
```javascript
// Hacía GET a /api/usuarios y buscaba usuario con password en texto plano
const url = `${API_CONFIG.USUARIO.BASE_URL}/api/usuarios`;
// ... compara password directamente en el cliente
```

**Ahora** (seguro con BCrypt):
```javascript
// Hace POST a /api/login con validación BCrypt en servidor
const url = `${API_CONFIG.USUARIO.BASE_URL}/api/login`;
// El microservicio valida con BCrypt de forma segura
```

## 🎯 Cómo Funciona

### 1. Usuario ingresa credenciales en el frontend

```javascript
// Login.jsx
const handleSubmit = async (e) => {
  const result = await login(email, password);
  // ...
};
```

### 2. El servicio envía POST al microservicio

```javascript
// usuario.service.js
POST http://34.193.190.24:8081/api/login
Body: {
  "email": "usuario@example.com",
  "password": "password123"
}
```

### 3. El microservicio valida con BCrypt

El microservicio (que ya creaste) hace:
- Busca el usuario por email en MongoDB
- Compara la contraseña con BCrypt
- Devuelve respuesta con success/error

### 4. El frontend recibe la respuesta

```javascript
// Respuesta exitosa
{
  "success": true,
  "message": "Login exitoso",
  "usuario": {
    "idUsuario": "507f1f77bcf86cd799439011",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": 123456789,
    "direccion": "Calle 123",
    "idTipoUsuario": 2,
    "estaActivo": "Y"
  }
}
```

## 🧪 Cómo Probar

### 1. Inicia el Frontend

```powershell
npm install  # Solo la primera vez
npm run dev
```

El frontend estará en: `http://localhost:5173`

### 2. Prueba el Login

1. Abre `http://localhost:5173`
2. Ve a la página de Login
3. Ingresa credenciales de un usuario existente en tu MongoDB
4. El login ahora usa BCrypt para validar

### 3. Verifica en la Consola del Navegador

Abre DevTools (F12) y ve a la pestaña Console:

```
🔐 Intentando login con: {email: "usuario@example.com"}
📡 Llamando al endpoint de login: http://34.193.190.24:8081/api/usuarios/login
📥 Respuesta del servidor: 200 OK
📦 Datos recibidos: {success: true, message: "Login exitoso"}
✅ Usuario autenticado: {id: "507f...", nombre: "Juan", ...}
💾 Token y usuario guardados en localStorage
```

## 🔍 Prueba el Endpoint Directamente

### Con PowerShell:

```powershell
$loginData = @{
    email = "usuario@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://34.193.190.24:8081/api/usuarios/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginData
```

### Con curl:

```bash
curl -X POST http://34.193.190.24:8081/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"password123"}'
```

## 📊 Estructura del Proyecto

```
team_10/  (Frontend React)
├── src/
│   ├── config/
│   │   └── api.config.js          # URLs de los microservicios
│   ├── services/
│   │   ├── usuario.service.js     # ✅ Actualizado para usar /login
│   │   └── producto.service.js    # Microservicio de productos
│   ├── contexts/
│   │   └── AuthContext.jsx        # Contexto de autenticación
│   └── pages/
│       └── Login.jsx               # Componente de login
```

## 🚨 Solución de Problemas

### Error: "No se pudo conectar con el microservicio"

**Causa**: El microservicio de usuarios no está corriendo o no es accesible.

**Solución**:
1. Verifica que el microservicio esté corriendo: `http://34.193.190.24:8081`
2. Prueba con curl o Postman si el endpoint responde
3. Verifica que CORS esté habilitado en el microservicio

### Error: "Credenciales inválidas"

**Causa**: Email o contraseña incorrectos.

**Solución**:
1. Verifica que el usuario exista en MongoDB
2. Asegúrate de que la contraseña esté encriptada con BCrypt en la BD
3. Revisa los logs del microservicio

### Login funciona pero usuario no tiene datos

**Causa**: El microservicio no está devolviendo todos los campos.

**Solución**:
1. Verifica la respuesta del endpoint con Postman
2. Asegúrate de que el microservicio esté devolviendo el objeto `usuario` completo

## 📚 Documentación de los Microservicios

### Microservicio de Usuarios

- **URL Base**: `http://34.193.190.24:8081`
- **Endpoints**:
  - `POST /api/login` - Login con BCrypt ✅
  - `GET /api/usuarios` - Listar usuarios
  - `POST /api/usuarios` - Crear usuario
  - `PUT /api/usuarios` - Actualizar usuario
  - `DELETE /api/usuarios/:id` - Eliminar usuario

### Microservicio de Productos

- **URL Base**: `http://34.202.46.121:8081`
- **Endpoints**:
  - `GET /api/productos` - Listar productos
  - `POST /api/productos` - Crear producto
  - `PUT /api/productos/:id` - Actualizar producto
  - `DELETE /api/productos/:id` - Eliminar producto

## 🔐 Seguridad Implementada

✅ **Contraseñas encriptadas** con BCrypt en el microservicio  
✅ **Validación en el backend** - El frontend solo envía credenciales  
✅ **No se exponen contraseñas** - El microservicio no devuelve passwords  
✅ **CORS habilitado** - Permite peticiones desde el frontend  
✅ **Mensajes genéricos** de error para no revelar información  

## ✨ Mejoras Futuras Sugeridas

1. **Rate Limiting**: Limitar intentos de login para prevenir ataques de fuerza bruta
2. **Refresh Tokens**: Para mantener sesiones activas de forma segura
3. **2FA**: Autenticación de dos factores opcional
4. **Logs centralizados**: Monitorear accesos y errores en tiempo real
5. **Notificaciones de seguridad**: Alertar sobre accesos sospechosos

## 🎯 Checklist de Verificación

- [ ] Frontend inicia correctamente en puerto 5173
- [ ] Puedo hacer login con credenciales correctas
- [ ] El login falla con credenciales incorrectas
- [ ] El usuario autenticado aparece en localStorage
- [ ] Los logs en la consola muestran el flujo correcto
- [ ] El microservicio está respondiendo en AWS
- [ ] MongoDB está conectado y accesible

---

**Última actualización**: 29 de noviembre de 2025  
**Rama**: `feature/integracion-microservicios-aws`  
**Arquitectura**: Frontend React + Microservicios AWS + MongoDB Atlas
