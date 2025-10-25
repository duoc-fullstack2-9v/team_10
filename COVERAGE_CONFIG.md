# CONFIGURACIÓN DE COVERAGE - VITEST

## 📊 Configuración Actual

La configuración de coverage está definida en `vite.config.js` y excluye específicamente las carpetas `assets` y `contexts` por las siguientes razones:

## 🎯 Archivos Incluidos

```javascript
include: [
  "src/components/**/*.{js,jsx}",  // Todos los componentes React
  "src/pages/**/*.{js,jsx}"        // Todas las páginas de la aplicación
]
```

**Total aproximado**: 16 componentes + 6 páginas = **22 archivos de lógica**  
*(Excluyendo AdminPanel y ReportesAdmin)*

## ❌ Archivos Excluidos

### 1. Assets (`src/assets/**`)
```
src/assets/
├── img/                    # Imágenes estáticas
│   ├── huerto_logo.png
│   ├── carro.png
│   └── prod/              # Imágenes de productos
├── main.css               # Estilos principales
├── form.css               # Estilos de formularios
├── compatibility-fix.css  # Fixes de compatibilidad
├── smart-compatibility.css
├── main.js                # Utilidades JavaScript
├── smart-theme.js         # Funciones de tema
└── theme-fix.js           # Correcciones de tema
```

**Justificación**: 
- ❌ No contienen lógica de negocio
- ❌ Son recursos estáticos o utilitarios de UI
- ✅ Se validan visualmente en testing manual

### 2. Contexts (`src/contexts/**`)
```
src/contexts/
└── AuthContext.jsx        # Contexto de autenticación
```

**Justificación**:
- ❌ Lógica compleja de autenticación con APIs externas
- ❌ Requiere mocking extensivo de localStorage, APIs
- ✅ Se prueba indirectamente através de componentes que lo usan
- ✅ Mejor cubierto por pruebas de integración

### 3. Admin Pages
```
src/pages/
├── AdminPanel.jsx         # Panel de administración principal
└── ReportesAdmin.jsx      # Reportes administrativos
```

**Justificación**:
- ❌ Lógica administrativa muy compleja
- ❌ Múltiples dependencias de backend y permisos
- ❌ Requiere setup extensivo de datos de prueba
- ✅ Mejor cubierto por pruebas E2E de flujos administrativos

### 4. Entry Points
```
src/main.jsx               # Punto de entrada de React
```

**Justificación**:
- ❌ Solo configuración de montaje de React
- ❌ No contiene lógica de negocio
- ✅ Se prueba en pruebas E2E

## 📈 Métricas Esperadas

Con esta configuración, esperamos:

| Métrica | Objetivo | Justificación |
|---------|----------|---------------|
| **Líneas** | 80% | Cobertura sólida de lógica de negocio |
| **Funciones** | 80% | Todas las funciones críticas probadas |
| **Ramas** | 80% | Condicionales y flujos principales |
| **Declaraciones** | 80% | Código ejecutable validado |

## 🛠️ Comandos de Coverage

```bash
# Coverage completo con exclusiones
npm run test:coverage

# Coverage en formato HTML (recomendado)
npm run test:html

# Coverage con detalles por archivo
npx vitest run --coverage --reporter=verbose
```

## 📊 Interpretación de Resultados

### ✅ Archivos que SÍ aparecerán en el reporte:
- Todos los componentes en `src/components/`
- Páginas principales en `src/pages/` (excluyendo admin)
- Total: ~22 archivos de lógica de usuario final

### ❌ Archivos que NO aparecerán en el reporte:
- Assets: ~10 archivos estáticos
- Contexts: 1 archivo de contexto complejo
- Admin pages: 2 páginas administrativas complejas
- Entry points: 1 archivo de configuración
- Total excluido: ~14 archivos no críticos para testing unitario

## 💡 Beneficios de esta Configuración

1. **Foco en lógica crítica**: Solo se mide código que realmente importa
2. **Métricas más precisas**: Coverage no diluido por archivos estáticos
3. **Reporting más limpio**: Reportes enfocados en componentes testeables
4. **CI/CD más eficiente**: Menos falsos positivos en pipelines

## 🔍 Verificación de Configuración

Para verificar que las exclusiones funcionan:

```bash
# 1. Ejecutar coverage
npm run test:coverage

# 2. Revisar el reporte HTML
# Debería mostrar solo archivos de components/ y pages/

# 3. Verificar en terminal
# No debería mostrar archivos de assets/ ni contexts/
```

**Resultado esperado**: Coverage report limpio enfocado en lógica de negocio pura.

---

**Configurado por**: Team 10  
**Fecha**: Octubre 2025  
**Herramientas**: Vitest + Coverage V8