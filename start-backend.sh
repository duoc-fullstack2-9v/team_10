#!/bin/bash

# Directorio del backend
BACKEND_DIR="backend"

echo "🚀 Iniciando servidor Spring Boot..."
echo "================================================"

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven no está instalado. Por favor, instala Maven primero."
    echo "💡 En macOS puedes usar: brew install maven"
    exit 1
fi

# Cambiar al directorio del backend
cd $BACKEND_DIR

echo "📦 Compilando aplicación..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo "✅ Compilación exitosa!"
    echo "🌟 Iniciando servidor en puerto 8080..."
    echo "📊 Backend API disponible en: http://localhost:8080"
    echo "🔄 CORS configurado para frontend en puerto 5173 y 5174"
    echo "================================================"
    
    # Ejecutar la aplicación Spring Boot
    mvn spring-boot:run
else
    echo "❌ Error en la compilación"
    exit 1
fi