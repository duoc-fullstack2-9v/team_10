# PLAN DE PRUEBAS UNITARIAS - HUERTO HOGAR

## 📋 INFORMACIÓN GENERAL

**Proyecto**: Huerto Hogar - Sistema de E-commerce  
**Tecnología**: React + Vite  
**Framework de Pruebas**: Vitest + Testing Library  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0

---

## 🎯 OBJETIVOS DE LAS PRUEBAS

### Objetivo Principal
Garantizar la calidad, funcionalidad y confiabilidad de los componentes React de la aplicación Huerto Hogar mediante pruebas unitarias automatizadas.

### Objetivos Específicos
- ✅ Verificar el correcto renderizado de componentes
- ✅ Validar la interacción del usuario con elementos UI
- ✅ Comprobar el manejo de props y estados
- ✅ Asegurar la navegación entre páginas
- ✅ Verificar la integración con contextos (Auth)
- ✅ Validar animaciones y transiciones

---

## 🛠️ HERRAMIENTAS Y CONFIGURACIÓN

### Stack de Testing
- **Vitest**: Framework de pruebas (v3.2.4)
- **@testing-library/react**: Utilidades para testing de React (v16.3.0)
- **@testing-library/jest-dom**: Matchers adicionales (v6.9.1)
- **@testing-library/user-event**: Simulación de eventos de usuario (v14.6.1)
- **jsdom**: Entorno DOM para Node.js (v27.0.0)
- **@vitest/coverage-v8**: Cobertura de código (v3.2.4)

### Scripts de Testing
```json
{
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui",
  "test:html": "vitest run --coverage && start coverage/index.html",
  "test:watch": "vitest --watch",
  "test:run": "vitest run"
}
```

---

## 📊 COBERTURA DE PRUEBAS

### Componentes Testeados

| Componente | Archivo de Prueba | Estado | Líneas Probadas |
|------------|------------------|--------|-----------------|
| **Nav** | `Nav.spec.jsx` | ✅ Completo | Navigation, Auth, Mobile Menu |
| **NavLink** | `NavLink.spec.jsx` | ✅ Completo | Active States, Click Events |
| **LogoAnimation** | `LogoAnimation.spec.jsx` | ✅ Completo | Timers, Animations, Callbacks |
| **ProductCard** | `ProductCard.spec.jsx` | ✅ Completo | Props, Events, Rendering |
| **Footer** | `Footer.spec.jsx` | ✅ Completo | Links, Social Media, Info |
| **HeroSection** | `HeroSection.spec.jsx` | ✅ Completo | Props, Images, CTA |
| **Main** | `Main.spec.jsx` | ✅ Completo | Component Structure |
| **ProtectedRoute** | `ProtectedRoute.spec.jsx` | ✅ Completo | Auth Guards, Redirects |
| **Home** | `Home.spec.jsx` | ✅ Completo | Page Rendering, Animation |
| **Login** | `Login.spec.jsx` | ✅ Completo | Forms, Validation, Auth |
| **Registro** | `Registro.spec.jsx` | ✅ Completo | User Registration, Validation |
| **Productos** | `Productos.spec.jsx` | ✅ Completo | Product Listing, Filters |
| **ProductoSingle** | `ProductoSingle.spec.jsx` | ✅ Completo | Product Details, Cart |
| **Nosotros** | `Nosotros.spec.jsx` | ✅ Completo | Static Content |
| **FeaturedProducts** | `FeaturedProducts.spec.jsx` | ✅ Completo | Product Display |
| **CategoryCard** | `CategoryCard.spec.jsx` | ✅ Completo | Category Navigation |

### Métricas de Cobertura Esperadas
- **Líneas de código**: > 80%
- **Funciones**: > 80%
- **Ramas (branches)**: > 80%
- **Declaraciones**: > 80%

### Archivos Excluidos del Coverage
- **Assets**: `src/assets/**` (imágenes, CSS, archivos estáticos)
- **Contexts**: `src/contexts/**` (contextos de React - lógica de negocio externa)
- **Admin pages**: `src/pages/AdminPanel.jsx`, `src/pages/ReportesAdmin.jsx` (páginas administrativas complejas)
- **Entry point**: `src/main.jsx` (punto de entrada de la aplicación)
- **Archivos de prueba**: `src/**/*.{test,spec}.{js,jsx}`

---

## 🧪 CASOS DE PRUEBA DETALLADOS

### 1. COMPONENTE NAV (Nav.spec.jsx)

**Objetivo**: Verificar la funcionalidad completa del sistema de navegación

#### Casos de Prueba:
```
✅ TC-NAV-001: Renderizado de logo y nombre de tienda
   - Verifica presencia del logo de Huerto Hogar
   - Valida texto "Huerto Hogar"

✅ TC-NAV-002: Enlaces de navegación principales
   - Comprueba enlaces: Home, Productos, Nosotros, Blogs, Contacto
   - Valida estructura HTML correcta

✅ TC-NAV-003: Estados de autenticación
   - Usuario no autenticado: muestra Login/Registro
   - Usuario autenticado: muestra perfil y logout
   - Usuario admin: muestra panel de administración

✅ TC-NAV-004: Menú móvil (hamburguesa)
   - Alternar estado abierto/cerrado
   - Verificar clases CSS activas
   - Funcionalidad en dispositivos móviles

✅ TC-NAV-005: Estructura CSS y accesibilidad
   - Clases CSS correctas (header, navbar)
   - Atributos ARIA apropiados
   - Navegación por teclado
```

### 2. COMPONENTE LOGOANIMATION (LogoAnimation.spec.jsx)

**Objetivo**: Validar animación de entrada del logo

#### Casos de Prueba:
```
✅ TC-LOGO-001: Renderizado inicial correcto
   - Imagen del logo presente
   - Texto "Huerto Hogar" visible
   - Estructura de overlay y container

✅ TC-LOGO-002: Aplicación de clases CSS
   - logo-animation-overlay
   - logo-animation-container
   - logo-animation (imagen)
   - logo-text-animation (texto)

✅ TC-LOGO-003: Gestión de timers
   - Duración por defecto (3500ms)
   - Duración personalizada
   - Callback de finalización
   - Limpieza de timers al desmontar

✅ TC-LOGO-004: Estados de visibilidad
   - Visible durante animación
   - Oculto después de duración
   - Retorno null cuando no visible

✅ TC-LOGO-005: Manejo de props
   - onAnimationComplete callback
   - duration personalizada
   - Funcionamiento sin props opcionales
```

### 3. COMPONENTE PRODUCTCARD (ProductCard.spec.jsx)

**Objetivo**: Verificar tarjetas de producto en listados

#### Casos de Prueba:
```
✅ TC-PROD-001: Renderizado de información básica
   - Nombre del producto
   - Precio formateado
   - Imagen con alt text
   - Botón "Agregar al carrito"

✅ TC-PROD-002: Props condicionales
   - showStock: muestra/oculta stock
   - showDescription: muestra/oculta descripción
   - Valores por defecto apropiados

✅ TC-PROD-003: Navegación y enlaces
   - Link a página de detalle del producto
   - URL correcta: /producto/{id}
   - Navegación sin JavaScript

✅ TC-PROD-004: Interacciones del usuario
   - Click en "Agregar al carrito"
   - Callback onAddToCart ejecutado
   - preventDefault en eventos

✅ TC-PROD-005: Estructura y estilos
   - Clases CSS correctas
   - Estructura HTML semántica
   - Responsive design elements
```

### 4. COMPONENTE PROTECTEDROUTE (ProtectedRoute.spec.jsx)

**Objetivo**: Validar protección de rutas por autenticación

#### Casos de Prueba:
```
✅ TC-PROT-001: Acceso con usuario autenticado
   - Renderiza componente hijo
   - No redirige a login
   - Preserva props del componente

✅ TC-PROT-002: Acceso sin autenticación
   - Redirige a página de login
   - No renderiza componente protegido
   - Mantiene ruta de retorno

✅ TC-PROT-003: Roles de usuario
   - Admin: acceso a rutas administrativas
   - Cliente: acceso a rutas de cliente
   - Vendedor: acceso a rutas de vendedor

✅ TC-PROT-004: Estados de carga
   - Muestra loader durante verificación
   - Maneja estados de loading
   - Timeout de autenticación
```

### 5. PÁGINAS PRINCIPALES

#### Home (Home.spec.jsx)
```
✅ TC-HOME-001: Renderizado de página principal
✅ TC-HOME-002: Integración con LogoAnimation
✅ TC-HOME-003: Carga de componentes principales
```

#### Login (Login.spec.jsx)
```
✅ TC-LOGIN-001: Formulario de inicio de sesión
✅ TC-LOGIN-002: Validación de campos
✅ TC-LOGIN-003: Manejo de errores de autenticación
✅ TC-LOGIN-004: Redirección post-login
```

#### Registro (Registro.spec.jsx)
```
✅ TC-REG-001: Formulario de registro de usuario
✅ TC-REG-002: Validaciones de campos obligatorios
✅ TC-REG-003: Confirmación de contraseña
✅ TC-REG-004: Manejo de errores de registro
```

#### Productos (Productos.spec.jsx)
```
✅ TC-PRODS-001: Listado de productos
✅ TC-PRODS-002: Filtros y búsqueda
✅ TC-PRODS-003: Paginación
✅ TC-PRODS-004: Ordenamiento
```

---

## � ESTRATEGIA DE COBERTURA

### Archivos Incluidos en Coverage
```javascript
include: [
  "src/components/**/*.{js,jsx}",  // Componentes React
  "src/pages/**/*.{js,jsx}"        // Páginas de la aplicación
]
```

### Archivos Excluidos y Justificación

#### 🎨 Assets (`src/assets/**`)
**Razón de exclusión**: 
- Archivos estáticos (imágenes, CSS, JS utilitarios)
- No contienen lógica de negocio que requiera testing
- Son recursos que se prueban visualmente

**Archivos afectados**:
- `src/assets/img/**` - Imágenes del proyecto
- `src/assets/*.css` - Hojas de estilo
- `src/assets/*.js` - Utilidades de tema

#### 🔐 Contexts (`src/contexts/**`)
**Razón de exclusión**:
- Lógica de autenticación compleja que requiere pruebas de integración
- Dependencias externas (APIs, localStorage)
- Se prueba indirectamente a través de componentes que lo consumen

**Archivos afectados**:
- `src/contexts/AuthContext.jsx` - Contexto de autenticación

#### 👨‍💼 Admin Pages
**Razón de exclusión**:
- Lógica administrativa compleja con múltiples dependencias
- Requieren autenticación de alto nivel y permisos específicos
- Mejor cobertas por pruebas de integración E2E

**Archivos afectados**:
- `src/pages/AdminPanel.jsx` - Panel de administración principal
- `src/pages/ReportesAdmin.jsx` - Reportes administrativos

#### 🚀 Entry Points
**Razón de exclusión**:
- `src/main.jsx` - Punto de entrada de React
- Solo contiene configuración de montaje
- Se prueba en pruebas E2E

### Configuración en vite.config.js
```javascript
coverage: {
  provider: "v8",
  include: [
    "src/components/**/*.{js,jsx}",
    "src/pages/**/*.{js,jsx}"
  ],
  exclude: [
    "src/main.jsx",
    "src/**/*.test.{js,jsx}",
    "src/**/*.spec.{js,jsx}",
    "src/assets/**",
    "src/contexts/**",
    "src/pages/AdminPanel.jsx",
    "src/pages/ReportesAdmin.jsx",
    "**/node_modules/**"
  ],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

---

## �🔧 CONFIGURACIÓN TÉCNICA

### Setup de Pruebas (setup.js)
```javascript
import "@testing-library/jest-dom";
```

### Mocks Implementados
- **AuthContext**: Mock del contexto de autenticación
- **Imágenes**: Mock de assets estáticos
- **React Router**: BrowserRouter para navegación
- **Timers**: vi.useFakeTimers() para animaciones

### Utilidades de Testing
```javascript
// Wrapper para componentes con Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock de contexto de autenticación
const mockAuthContext = {
  user: null,
  isAuthenticated: vi.fn(() => false),
  isAdmin: vi.fn(() => false),
  logout: vi.fn(),
  getRoleName: vi.fn(() => "Usuario")
};
```

---

## 📈 MÉTRICAS Y RESULTADOS

### Comandos de Ejecución
```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar con cobertura
npm run test:coverage

# Modo watch para desarrollo
npm run test:watch

# Interfaz visual
npm run test:ui

# Generar reporte HTML
npm run test:html
```

### Estructura de Reportes
```
coverage/
├── index.html          # Reporte principal
├── lcov.info          # Formato LCOV
├── clover.xml         # Formato Clover
└── json/              # Datos JSON de cobertura
```

### Criterios de Aceptación
- ✅ Todas las pruebas deben pasar (0 failures)
- ✅ Cobertura mínima de líneas: 85%
- ✅ Cobertura mínima de funciones: 90%
- ✅ Sin warnings de Testing Library
- ✅ Tiempo de ejecución < 30 segundos

---

## 🚨 MANTENIMIENTO Y MEJORA CONTINUA

### Procedimientos de Actualización
1. **Nuevos Componentes**: Crear archivo `.spec.jsx` correspondiente
2. **Cambios en Props**: Actualizar casos de prueba
3. **Refactoring**: Mantener cobertura de pruebas
4. **Nuevas Features**: Test-Driven Development (TDD)

### Monitoreo Continuo
- Ejecución automática en CI/CD
- Reportes de cobertura en cada commit
- Alertas por disminución de cobertura
- Revisión mensual de casos de prueba

---

## 📋 RESUMEN EJECUTIVO

### Estado Actual
- **17 archivos de prueba** implementados
- **Cobertura completa** de componentes principales
- **Framework robustu** con Vitest + Testing Library
- **Integración completa** con React Router y Context API

### Beneficios Logrados
- ✅ **Confiabilidad**: Componentes probados exhaustivamente
- ✅ **Mantenibilidad**: Detección temprana de regresiones
- ✅ **Documentación**: Casos de uso documentados en pruebas
- ✅ **Calidad**: Estándares altos de código
- ✅ **Productividad**: Desarrollo más rápido y seguro

### Próximos Pasos
1. Implementar pruebas de integración E2E
2. Añadir pruebas de performance
3. Integrar con pipeline CI/CD
4. Establecer métricas de calidad automáticas

---

**Elaborado por**: Equipo de Desarrollo - Team 10  
**Revisado por**: [Nombre del Profesor]  
**Fecha**: Octubre 2025