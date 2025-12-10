# 🧪 Guía de Pruebas - Correcciones UX

## ✅ Cambios Implementados (NO COMMITEADOS)

### 1. Sistema de Notificaciones Toast
- **Archivos nuevos**:
  - `src/components/Toast.jsx`
  - `src/assets/toast.css`

### 2. Servicio de Imágenes S3
- **Archivo actualizado**: `src/services/imagen.service.js`
- **Endpoint usado**: `http://34.202.46.121:8081/api/productos/generar-url-subida`
- **Flujo**:
  1. Frontend solicita URL prefirmada con `fileName`
  2. Backend responde con `{ presignedUrl, publicUrl }`
  3. Frontend sube imagen directamente a S3 usando `presignedUrl`
  4. Frontend guarda `publicUrl` en el campo `linkImagen` del producto

### 3. Páginas Modificadas
- `src/components/Nav.jsx` - Resaltado de Login/Registro
- `src/pages/Login.jsx` - Toast en login
- `src/pages/Registro.jsx` - Toast en registro
- `src/pages/ProductDetail.jsx` - Toast al agregar al carrito
- `src/pages/Carrito.jsx` - Prioridad de imágenes (linkImagen → imagen → SVG)
- `src/pages/AdminPanel.jsx` - Subida de imágenes a S3

---

## 🧪 Plan de Pruebas

### Test 1: Navegación - Resaltado Activo
1. Ir a `/login`
2. ✅ Verificar que el botón "Login" esté resaltado en verde
3. Ir a `/registro`
4. ✅ Verificar que el botón "Registro" esté resaltado en verde

### Test 2: Login con Toast
1. Intentar login con credenciales incorrectas
2. ✅ Debe aparecer Toast rojo: "Email o contraseña incorrectos"
3. Login con credenciales correctas
4. ✅ Debe aparecer Toast verde: "¡Bienvenido {nombre}!"
5. ✅ Debe redirigir a Home después de 1.5s

### Test 3: Registro con Toast
1. Intentar registrar email que ya existe
2. ✅ Debe aparecer Toast rojo: "Este correo electrónico ya está registrado"
3. Registrar usuario nuevo
4. ✅ Debe aparecer Toast verde: "¡Usuario registrado correctamente! Redirigiendo..."
5. ✅ Debe redirigir a /login después de 3s

### Test 4: Agregar al Carrito
1. Ir a detalle de un producto
2. Seleccionar cantidad y hacer clic en "Agregar al Carrito"
3. ✅ Debe aparecer Toast verde: "{cantidad} {nombre} agregado al carrito"
4. ✅ NO debe aparecer alert() del navegador

### Test 5: Imágenes en Carrito
1. Agregar varios productos al carrito
2. Ir a `/carrito`
3. ✅ Verificar que todas las imágenes se muestren correctamente
4. ✅ Si un producto no tiene imagen, debe mostrar SVG con 🌱 "Sin imagen"

### Test 6: Subida de Imagen a S3 (AdminPanel)
**IMPORTANTE**: Este test requiere:
- Estar logueado como administrador
- Conexión al microservicio de productos (34.202.46.121:8081)
- Bucket S3 configurado correctamente

#### Pasos:
1. Login como admin
2. Ir a Panel de Administración → Productos
3. Hacer clic en "Crear Producto"
4. Llenar campos obligatorios:
   - ID Producto: `PR001` (formato: XX000)
   - Nombre: `Producto Test`
   - Precio: `1000`
   - Stock: `10`
5. **Opción A - URL Manual**:
   - Pegar URL de imagen externa
   - ✅ Debe mostrarse preview de 200x200px
6. **Opción B - Subir Archivo**:
   - Hacer clic en "Choose File"
   - Seleccionar imagen (máx 5MB)
   - ✅ Debe aparecer Toast azul: "Subiendo imagen a S3..."
   - ✅ Debe mostrarse preview local inmediatamente
   - ✅ Debe aparecer Toast verde: "✅ Imagen subida exitosamente"
   - ✅ El campo `linkImagen` debe llenarse con la URL de S3
7. Hacer clic en botón X rojo para quitar imagen
8. ✅ Debe limpiarse el preview y el campo linkImagen
9. Crear producto sin imagen
10. ✅ Debe guardarse con SVG genérico (🌱)

---

## 🔍 Verificación de Consola

### Endpoint de URL Prefirmada
Probar manualmente:
```bash
curl "http://34.202.46.121:8081/api/productos/generar-url-subida?fileName=test-image.jpg"
```

Respuesta esperada:
```json
{
  "presignedUrl": "https://s3.amazonaws.com/...",
  "publicUrl": "https://s3.amazonaws.com/..."
}
```

### Validaciones de Imagen
El servicio debe rechazar:
- ❌ Archivos que no sean imágenes
- ❌ Imágenes mayores a 5MB

---

## 🐛 Posibles Errores y Soluciones

### Error: "Network Error" al subir imagen
**Causa**: Backend no responde o CORS bloqueado
**Solución**: 
1. Verificar que el microservicio esté corriendo: `http://34.202.46.121:8081`
2. Verificar CORS en el backend
3. Revisar consola del navegador para detalles

### Error: "Error al subir la imagen"
**Causa**: URL prefirmada expiró o bucket S3 no existe
**Solución**:
1. Verificar que el bucket `huerto-hogar-images` existe en AWS
2. Verificar permisos del bucket
3. La URL prefirmada expira después de cierto tiempo (verificar backend)

### Preview se muestra pero no sube a S3
**Causa**: Error en la petición PUT a S3
**Solución**:
1. Verificar CORS del bucket S3
2. Verificar que la URL prefirmada tenga permisos de escritura
3. Revisar Network tab del navegador para ver el error exacto

### Toast no aparece
**Causa**: Estado no se actualiza correctamente
**Solución**:
1. Verificar que el componente Toast esté importado
2. Verificar que `toast.message` tenga valor
3. Revisar consola de React DevTools

---

## 📊 Checklist de Validación

### UX/UI
- [ ] Navegación: Login/Registro se resaltan cuando activos
- [ ] No aparecen alerts() del navegador en ninguna página
- [ ] Todos los mensajes usan Toast elegante
- [ ] Toasts se auto-cierran después de 3 segundos
- [ ] Botón X funciona para cerrar Toast manualmente

### Imágenes
- [ ] Carrito muestra imágenes correctamente
- [ ] Productos sin imagen muestran SVG genérico
- [ ] AdminPanel permite pegar URL manual
- [ ] AdminPanel permite subir archivo
- [ ] Preview se muestra antes de guardar
- [ ] Botón X quita imagen correctamente

### Funcionalidad
- [ ] Login redirige correctamente después de Toast
- [ ] Registro redirige a Login después de 3s
- [ ] Agregar al carrito muestra cantidad correcta
- [ ] Validación de imágenes funciona (tipo y tamaño)
- [ ] Subida a S3 retorna URL pública

---

## 🚀 Comandos Útiles

### Iniciar el proyecto
```bash
npm run dev
```

### Ver logs del navegador
```bash
# Abrir DevTools (F12)
# Ir a pestaña Console
# Filtrar por "imagen" o "s3" para ver logs relevantes
```

### Probar endpoint backend
```bash
# Generar URL prefirmada
curl "http://34.202.46.121:8081/api/productos/generar-url-subida?fileName=test.jpg"

# Ver Swagger
open http://34.202.46.121:8081/swagger-ui/index.html
```

---

## 📝 Notas Importantes

1. **NO COMMITEAR** estos cambios aún según instrucciones del usuario
2. El sistema usa **URL prefirmadas** (presigned URLs) para mayor seguridad
3. La subida es **directa a S3** sin pasar por el backend
4. El backend solo genera la URL, no maneja el archivo
5. Si falla S3, el preview local se mantiene (base64) como fallback

---

## ✨ Mejoras Futuras (Opcional)

- [ ] Barra de progreso durante subida
- [ ] Recorte de imagen antes de subir
- [ ] Compresión automática de imágenes grandes
- [ ] Múltiples imágenes por producto (galería)
- [ ] Lazy loading de imágenes en catálogo
