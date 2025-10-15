// ===== CORRECCIÓN INTELIGENTE DE FUENTES PARA macOS =====
// Solo se activa después de las 8pm y en macOS

function applyMacOSFontFix() {
  const now = new Date();
  const hour = now.getHours();
  const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Solo aplicar si es macOS, después de las 8pm O si está en modo oscuro
  if (isMacOS && (hour >= 20 || isDarkMode)) {
    console.log('🍎 Aplicando corrección de fuentes para macOS (hora: ' + hour + ')');
    document.documentElement.classList.add('macos-font-fix');
    document.body.classList.add('macos-font-fix');
  } else {
    // Remover si no es necesario
    document.documentElement.classList.remove('macos-font-fix');
    document.body.classList.remove('macos-font-fix');
  }
}

// Solo ejecutar si es macOS
if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
  // Ejecutar al cargar
  document.addEventListener('DOMContentLoaded', applyMacOSFontFix);
  
  // Monitorear cambios de tema
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(applyMacOSFontFix);
  }
  
  // Verificar cada hora por si cambia la hora
  setInterval(applyMacOSFontFix, 60000 * 60); // cada hora
}