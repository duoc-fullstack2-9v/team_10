/* ===== SCRIPT ANTI MODO-OSCURO AUTOMÁTICO macOS ===== */
/* Prevenir cambios de tema por horario del sistema */

// Forzar modo claro permanentemente
function forceThemeToLight() {
  // Detectar si el sistema está en modo oscuro
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDarkMode) {
    console.log('🌙 Modo oscuro detectado - Forzando modo claro...');
    
    // Agregar clase CSS para sobrescribir
    document.documentElement.classList.add('force-light-mode');
    document.body.classList.add('force-light-mode');
    
    // Forzar estilos directamente
    document.documentElement.style.setProperty('color-scheme', 'light', 'important');
    document.documentElement.style.setProperty('color', '#333333', 'important');
    document.documentElement.style.setProperty('background-color', '#F7F7F7', 'important');
    
    // Forzar estilos de botones
    document.documentElement.style.setProperty('--accent', '#2E8B57', 'important');
    document.documentElement.style.setProperty('--primary-color', '#2E8B57', 'important');
    
    // Aplicar estilos a todos los botones existentes
    const buttons = document.querySelectorAll('button, .shop-now-button, .add-to-cart-button, input[type="submit"], input[type="button"]');
    buttons.forEach(button => {
      button.style.setProperty('background-color', '#2E8B57', 'important');
      button.style.setProperty('color', '#ffffff', 'important');
      button.style.setProperty('border', '1px solid #2E8B57', 'important');
    });
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', forceThemeToLight);

// Monitorear cambios de tema del sistema
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener(forceThemeToLight);
}

// Ejecutar cada vez que cambia la visibilidad de la página
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    forceThemeToLight();
  }
});

// Función para forzar estilos de botones
function forceButtonStyles() {
  const buttons = document.querySelectorAll('button, .shop-now-button, .add-to-cart-button, input[type="submit"], input[type="button"], [role="button"]');
  buttons.forEach(button => {
    button.style.setProperty('background-color', '#2E8B57', 'important');
    button.style.setProperty('color', '#ffffff', 'important');
    button.style.setProperty('border', '1px solid #2E8B57', 'important');
    button.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
  });
}

// Observer para detectar nuevos elementos (React renderizado dinámico)
const observer = new MutationObserver(() => {
  forceThemeToLight();
  forceButtonStyles();
});

// Observar cambios en el DOM
observer.observe(document.body, { 
  childList: true, 
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
});

// Verificar solo cuando sea necesario (reducir interferencias)
// setInterval(() => {
//   forceThemeToLight();
//   forceButtonStyles();
// }, 30000);

console.log('✅ Script anti-modo-oscuro-automático cargado con observer DOM');