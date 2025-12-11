# 9. PRUEBAS Y TESTING

## 9.1 Estrategia de Testing

El proyecto **Huerto Hogar** implementa una estrategia de testing integral basada en pruebas unitarias con enfoque en componentes críticos de la interfaz de usuario.

### 9.1.1 Framework de Testing
- **Vitest 3.2.4**: Framework de testing optimizado para Vite
- **@testing-library/react 16.3.0**: Utilidades para testing de componentes React
- **@testing-library/user-event 14.6.1**: Simulación de interacciones de usuario
- **@testing-library/jest-dom 6.6.3**: Matchers personalizados para aserciones DOM
- **@vitest/ui**: Interfaz web interactiva para visualización de tests
- **@vitest/coverage-v8**: Generación de reportes de cobertura

### 9.1.2 Configuración del Entorno
```javascript
// vitest.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/**/*.spec.jsx']
    }
  }
});
```

---

## 9.2 Suite de Pruebas Unitarias

**Estado actual**: **51 tests pasando** en 8 archivos de prueba

### 9.2.1 Tests de Componentes de Navegación

#### **Nav.jsx** - 5 tests
**Cobertura**: 49.52% (líneas), 43.75% (ramas)

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders navigation bar correctly | Verifica renderizado del navbar principal |
| 2 | renders cart icon with item count | Valida badge del carrito con cantidad de items |
| 3 | toggles mobile menu | Simula apertura/cierre del menú móvil |
| 4 | renders navigation links | Comprueba que todos los enlaces de navegación existan |
| 5 | handles user authentication state | Verifica comportamiento según estado de autenticación |

**Líneas no cubiertas**: Lógica de autenticación compleja (98-199), handlers de eventos (221-237)

---

#### **Footer.jsx** - 6 tests
**Cobertura**: 100% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders footer correctly | Valida renderizado completo del footer |
| 2 | renders all footer columns | Verifica presencia de 4 columnas (Logo, Enlaces, Contacto, Redes) |
| 3 | renders copyright notice | Comprueba copyright con año actual |
| 4 | renders social links | Valida enlaces a redes sociales |
| 5 | renders navigation links | Verifica enlaces de navegación del footer |
| 6 | renders contact information | Comprueba información de contacto |

---

#### **HeroSection.jsx** - 5 tests
**Cobertura**: 100% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders hero section with title and subtitle | Valida renderizado de textos principales |
| 2 | renders action buttons | Verifica presencia de botones de acción |
| 3 | has correct styling classes | Comprueba clases CSS correctas |
| 4 | buttons have correct links | Valida rutas de navegación de botones |
| 5 | renders decorative elements | Verifica elementos visuales decorativos |

---

#### **Main.jsx** - 4 tests
**Cobertura**: 100% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders main component | Valida renderizado del componente principal |
| 2 | renders all child components | Verifica presencia de Hero, Featured, Description |
| 3 | has correct structure | Comprueba estructura HTML correcta |
| 4 | applies correct classes | Valida clases CSS aplicadas |

---

### 9.2.2 Tests de Componentes de Utilidad

#### **Toast.jsx** - 8 tests ⭐ **NUEVO**
**Cobertura**: 100% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders success toast | Valida renderizado de notificación de éxito |
| 2 | renders error toast | Verifica notificación de error |
| 3 | renders warning toast | Comprueba notificación de advertencia |
| 4 | renders info toast | Valida notificación informativa |
| 5 | does not render when message is empty | Verifica que no renderiza sin mensaje |
| 6 | calls onClose when close button is clicked | Valida funcionalidad del botón cerrar |
| 7 | auto-closes after duration | Comprueba cierre automático (3000ms default) |
| 8 | does not auto-close when duration is 0 | Verifica que duration=0 previene auto-cierre |

**Técnicas de testing aplicadas**:
- Simulación de timers con `vi.useFakeTimers()`
- Testing de callbacks con `vi.fn()`
- Manipulación directa del DOM para eventos de click
- Validación de clases CSS según tipo de mensaje

---

#### **FooterColumn.jsx** - 6 tests ⭐ **NUEVO**
**Cobertura**: 100% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders logo column with description | Valida columna de logo con texto descriptivo |
| 2 | renders links column | Verifica columna de enlaces de navegación |
| 3 | renders contact column | Comprueba columna de contacto (email, teléfono) |
| 4 | renders social column with links | Valida columna de redes sociales |
| 5 | scrolls to top when clicking logo | Verifica funcionalidad scroll-to-top |
| 6 | renders empty content gracefully | Comprueba renderizado con contenido vacío |

**Técnicas de testing aplicadas**:
- Testing de scroll con `window.scrollTo` spy
- Validación de React Router Link con `MemoryRouter`
- Testing de props condicionales (logo, links, contact, social)

---

### 9.2.3 Tests de Seguridad y Autorización

#### **ProtectedRoute.jsx** - 6 tests ⭐ **NUEVO**
**Cobertura**: 94.64% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders children when user is authenticated | Valida acceso para usuario autenticado |
| 2 | renders "Acceso denegado" when not authenticated | Verifica denegación sin autenticación |
| 3 | renders children when user is admin | Comprueba acceso para rol administrador |
| 4 | denies access when user is not admin | Valida denegación para no-administradores |
| 5 | allows access when user is vendedor | Verifica acceso para rol vendedor |
| 6 | renders custom fallback when provided | Comprueba renderizado de fallback personalizado |

**Técnicas de testing aplicadas**:
- Mocking de `AuthContext` con `vi.mock()`
- Testing de autorización basada en roles (admin, vendedor, cliente)
- Validación de renderizado condicional según estado de autenticación
- Testing de props opcionales (fallback personalizado)

**Líneas no cubiertas**: Edge cases de roles no implementados (36-37, 39)

---

### 9.2.4 Tests de Lógica de Negocio

#### **ProductCard.jsx** - 11 tests ⭐ **NUEVO**
**Cobertura**: 93.45% ✅

| # | Caso de Prueba | Descripción |
|---|----------------|-------------|
| 1 | renders product information correctly | Valida renderizado completo de información del producto |
| 2 | renders product with legacy props | Comprueba compatibilidad con props antiguas (id, title, price, image) |
| 3 | increments quantity when + button is clicked | Verifica incremento de cantidad |
| 4 | decrements quantity when - button is clicked | Valida decremento de cantidad |
| 5 | does not decrement below 1 | Comprueba límite mínimo de cantidad |
| 6 | does not increment above stock | Verifica límite máximo según stock |
| 7 | calls addToCart with correct data | Valida llamada al contexto con datos correctos |
| 8 | shows "Agregado" feedback after adding | Comprueba feedback visual post-agregado |
| 9 | disables button when quantity exceeds stock | Verifica deshabilitación por stock insuficiente |
| 10 | disables button while adding to cart | Comprueba deshabilitación durante operación asíncrona |
| 11 | renders product description when available | Valida renderizado de descripción del producto |

**Técnicas de testing aplicadas**:
- Mocking de `CartContext` con `vi.mock()`
- Testing de interacciones de usuario con botones
- Validación de estados de UI (loading, feedback, disabled)
- Testing de formateo de precios con locale chileno (`toLocaleString('es-CL')`)
- Validación de límites (min/max quantity, stock)
- Testing de compatibilidad con props legacy

**Líneas no cubiertas**: Lógica de edición de productos (líneas 27, 69-70, 126-128)

---

## 9.3 Métricas de Cobertura

### 9.3.1 Resumen Global
```
Test Files:  8 passed (8)
Tests:       51 passed (51)
Duration:    1.56s
```

### 9.3.2 Cobertura por Categoría

| Categoría | Stmts | Branch | Funcs | Lines | Archivos |
|-----------|-------|--------|-------|-------|----------|
| **Componentes 100%** | 100% | 100% | 100% | 100% | 5 archivos |
| **Componentes >90%** | 93-95% | 57-76% | 50-100% | 93-95% | 2 archivos |
| **Componentes parcial** | 49% | 44% | 20% | 49% | 1 archivo |
| **Sin cobertura** | 0% | 0% | 0% | 0% | 15 archivos |

### 9.3.3 Desglose Detallado

#### **Componentes con 100% de cobertura** ✅
1. **Footer.jsx**: 100% statements, 100% branches, 100% functions, 100% lines
2. **FooterColumn.jsx**: 100% statements, 100% branches, 100% functions, 100% lines
3. **HeroSection.jsx**: 100% statements, 100% branches, 100% functions, 100% lines
4. **Main.jsx**: 100% statements, 100% branches, 100% functions, 100% lines
5. **Toast.jsx**: 100% statements, 100% branches, 100% functions, 100% lines

#### **Componentes con alta cobertura** ⭐
6. **ProductCard.jsx**: 93.45% statements, 75.67% branches, 50% functions, 93.45% lines
   - No cubiertas: Lógica de edición de productos (27, 69-70, 126-128)
7. **ProtectedRoute.jsx**: 94.64% statements, 57.14% branches, 100% functions, 94.64% lines
   - No cubiertas: Edge cases de roles (36-37, 39)

#### **Componentes con cobertura parcial**
8. **Nav.jsx**: 49.52% statements, 43.75% branches, 20% functions, 49.52% lines
   - No cubiertas: Lógica de autenticación compleja (98-199, 221-237)

---

## 9.4 Comandos de Ejecución

### 9.4.1 Ejecutar Tests

```bash
# Ejecutar todos los tests (modo watch)
npm run test

# Ejecutar tests una vez (CI mode)
npm run test:run
# O alternativamente:
npx vitest run

# Ejecutar tests en modo watch
npx vitest
```

### 9.4.2 Generar Reporte de Cobertura

```bash
# Generar reporte de cobertura completo
npm run test:coverage

# El reporte se genera en: coverage/index.html
# Abrir en navegador:
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### 9.4.3 Interfaz Visual de Tests

```bash
# Abrir interfaz web de Vitest UI
npm run test:ui

# Se abrirá automáticamente en:
# http://localhost:51204/__vitest__/
```

**Características de Vitest UI**:
- Visualización en tiempo real de ejecución de tests
- Exploración interactiva de tests por archivo
- Filtrado por estado (passed, failed, skipped)
- Visualización de errores y stack traces
- Re-ejecución selectiva de tests individuales

---

## 9.5 Buenas Prácticas Implementadas

### 9.5.1 Organización de Tests
- **Nomenclatura consistente**: `ComponentName.spec.jsx`
- **Ubicación centralizada**: Directorio `tests/` en raíz del proyecto
- **Setup compartido**: Archivo `tests/setup.js` para configuración global

### 9.5.2 Estrategias de Mocking
```javascript
// Mocking de contextos complejos
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => mockAuthValue
}));

// Mocking de funciones del carrito
const mockCartContext = {
  cart: [],
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn()
};
```

### 9.5.3 Testing de Interacciones de Usuario
```javascript
// Simulación de clicks
const button = screen.getByRole('button', { name: /agregar/i });
fireEvent.click(button);

// Validación de inputs
const input = screen.getByRole('spinbutton');
expect(input).toHaveValue(1);

// Testing de navegación
const link = screen.getByRole('link', { name: /productos/i });
expect(link).toHaveAttribute('href', '/productos');
```

### 9.5.4 Validación de Estados de UI
```javascript
// Verificar estados de loading
expect(button).toBeDisabled();
expect(screen.getByText(/agregando/i)).toBeInTheDocument();

// Validar feedback visual
await waitFor(() => {
  expect(screen.getByText(/agregado/i)).toBeInTheDocument();
});

// Comprobar clases CSS
expect(toastElement).toHaveClass('toast', 'toast-success');
```

---

## 9.6 Áreas de Mejora Futura

### 9.6.1 Tests Pendientes
Los siguientes componentes y servicios aún no cuentan con cobertura de tests:

**Páginas**:
- AdminPanel.jsx (1467 líneas) - Gestión de usuarios, productos, estadísticas
- Carrito.jsx (707 líneas) - Proceso de checkout y pago
- Perfil.jsx (576 líneas) - Actualización de datos de usuario
- ProductDetail.jsx (456 líneas) - Detalle de producto individual
- Login.jsx, Registro.jsx - Autenticación y registro

**Servicios**:
- usuario.service.js (228 líneas) - API de usuarios
- producto.service.js (264 líneas) - API de productos
- imagen.service.js (123 líneas) - Carga de imágenes

**Contextos**:
- AuthContext.jsx (115 líneas) - Gestión de autenticación
- CartContext.jsx (131 líneas) - Gestión del carrito

**Hooks personalizados**:
- useProductos.js (84 líneas) - Hook de carga de productos

### 9.6.2 Tipos de Tests Recomendados

1. **Tests de Integración**: Validar flujos completos (login → navegación → compra)
2. **Tests E2E**: Pruebas end-to-end con Playwright o Cypress
3. **Tests de Servicios**: Mocking de llamadas Axios a microservicios
4. **Tests de Contextos**: Validación de lógica de estado global
5. **Tests de Hooks**: Testing de custom hooks con `renderHook`

### 9.6.3 Mejoras en Cobertura

**Objetivo a corto plazo**: 60% de cobertura global
- ✅ Componentes críticos: **100%** (Footer, Toast, ProtectedRoute)
- 🎯 Páginas principales: 40-50% (Home, Productos, Carrito)
- 🎯 Servicios: 30-40% (happy path + manejo de errores)

**Objetivo a mediano plazo**: 80% de cobertura global
- 🎯 Todas las páginas: 70-80%
- 🎯 Todos los servicios: 60-70%
- 🎯 Contextos y hooks: 80-90%

---

## 9.7 Integración Continua (CI/CD)

### 9.7.1 GitHub Actions (Recomendado)

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### 9.7.2 Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:run",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

---

## 9.8 Conclusiones

### 9.8.1 Estado Actual del Testing
✅ **Fortalezas**:
- Suite de 51 tests unitarios robusta y mantenible
- 5 componentes críticos con 100% de cobertura
- Infraestructura de testing moderna (Vitest + Testing Library)
- Interfaz visual para debugging (Vitest UI)
- Reportes de cobertura detallados

⚠️ **Áreas de mejora**:
- Cobertura global aún baja (21.03% total)
- Páginas complejas sin tests (AdminPanel, Carrito, Perfil)
- Servicios sin validación de errores de API
- Falta de tests de integración y E2E

### 9.8.2 Impacto en Calidad del Software
El proyecto **Huerto Hogar** demuestra un compromiso con la calidad mediante:
1. **Testing de componentes críticos**: Toast, ProtectedRoute, ProductCard
2. **Validación de seguridad**: Tests de autorización y roles
3. **Prevención de regresiones**: Suite de tests ejecutable en CI/CD
4. **Documentación viva**: Tests como especificación del comportamiento esperado

### 9.8.3 Recomendaciones
1. Priorizar testing de páginas de alto tráfico (Home, Productos, Carrito)
2. Implementar tests de servicios con mocking de respuestas API
3. Agregar tests E2E para flujos críticos (registro, login, compra)
4. Configurar CI/CD con ejecución automática de tests
5. Establecer umbral mínimo de cobertura (ej: 60%) para nuevos PRs

---

**Fecha de última actualización**: 11 de diciembre de 2025  
**Responsable**: Team 10 - DSY1104  
**Suite de pruebas**: Vitest 3.2.4 + @testing-library/react 16.3.0
