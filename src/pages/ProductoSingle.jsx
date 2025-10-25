import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../assets/main.css';

// Importar las imágenes
import manzanaImg from '../assets/img/prod/manzana-funji.png';
import naranjasImg from '../assets/img/prod/naranjas-valencia.png';
import platanosImg from '../assets/img/prod/platanos-cavendish.png';
import zanahoriasImg from '../assets/img/prod/zanahorias-organicas.png';
import espinacasImg from '../assets/img/prod/espinacas-frescas.png';
import pimientosImg from '../assets/img/prod/pimientos-tricolores.png';
import mielImg from '../assets/img/prod/miel-organica.png';
import quinoaImg from '../assets/img/quinoa.jpg';
import lecheImg from '../assets/img/leche.jpg';

function ProductoSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);

  // Base de datos de productos (misma que en Productos.jsx)
  const productos = [
    {
      id: 1,
      nombre: "Manzanas Fuji",
      precio: "$1,200 CLP por kilo",
      precioNumerico: 1200,
      stock: "150 kilos",
      descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
      descripcionLarga: "Las manzanas Fuji son conocidas por su textura crujiente y su sabor dulce equilibrado. Cultivadas en el Valle del Maule bajo condiciones óptimas, estas manzanas mantienen su frescura y calidad nutricional. Ricas en fibra y antioxidantes, son perfectas para consumir frescas o en preparaciones culinarias.",
      imagen: manzanaImg,
      categoria: "frutas",
      alt: "Manzanas Fuji",
      origen: "Valle del Maule, Chile",
      beneficios: ["Rica en fibra", "Antioxidantes naturales", "Vitamina C", "Potasio"]
    },
    {
      id: 2,
      nombre: "Naranjas Valencia",
      precio: "$1,000 CLP por kilo",
      precioNumerico: 1000,
      stock: "200 kilos",
      descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos.",
      descripcionLarga: "Las naranjas Valencia son reconocidas mundialmente por su alto contenido de jugo y su sabor equilibrado entre dulce y ácido. Perfectas para la elaboración de jugos naturales, estas naranjas mantienen su frescura y propiedades nutricionales gracias a nuestro cuidadoso proceso de selección y almacenamiento.",
      imagen: naranjasImg,
      categoria: "frutas",
      alt: "Naranjas Valencia",
      origen: "Región de Coquimbo, Chile",
      beneficios: ["Alto contenido de vitamina C", "Fibra natural", "Ácido fólico", "Potasio"]
    },
    {
      id: 3,
      nombre: "Plátanos Cavendish",
      precio: "$800 CLP por kilo",
      precioNumerico: 800,
      stock: "250 kilos",
      descripcion: "Plátanos maduros y dulces, perfectos para el desayuno.",
      descripcionLarga: "Los plátanos Cavendish son la variedad más popular y consumida en el mundo. Su textura cremosa y sabor dulce los convierte en el complemento perfecto para desayunos, smoothies y postres. Ricos en potasio y energía natural, son ideales para deportistas y personas activas.",
      imagen: platanosImg,
      categoria: "frutas",
      alt: "Plátanos Cavendish",
      origen: "Ecuador",
      beneficios: ["Alto contenido de potasio", "Energía natural", "Vitamina B6", "Fibra digestiva"]
    },
    {
      id: 4,
      nombre: "Zanahorias Orgánicas",
      precio: "$900 CLP por kilo",
      precioNumerico: 900,
      stock: "100 kilos",
      descripcion: "Zanahorias crujientes cultivadas sin pesticidas.",
      descripcionLarga: "Nuestras zanahorias orgánicas son cultivadas sin el uso de pesticidas ni fertilizantes sintéticos, siguiendo estrictos protocolos de agricultura orgánica. Su sabor dulce natural y textura crujiente las hace perfectas tanto para consumo crudo como cocido.",
      imagen: zanahoriasImg,
      categoria: "verduras",
      alt: "Zanahorias Orgánicas",
      origen: "Región de La Araucanía, Chile",
      beneficios: ["Beta-caroteno (Vitamina A)", "Fibra natural", "Antioxidantes", "Cultivo orgánico"]
    },
    {
      id: 5,
      nombre: "Espinacas Frescas",
      precio: "$700 CLP por bolsa de 500g",
      precioNumerico: 700,
      stock: "80 bolsas",
      descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas.",
      descripcionLarga: "Espinacas de hoja tierna y fresca, cosechadas en el punto óptimo de maduración para conservar todos sus nutrientes. Ideales para ensaladas, smoothies verdes o como acompañamiento cocido. Su alto contenido de hierro y vitaminas las convierte en un superalimento imprescindible.",
      imagen: espinacasImg,
      categoria: "verduras",
      alt: "Espinacas Frescas",
      origen: "Región Metropolitana, Chile",
      beneficios: ["Alto contenido de hierro", "Ácido fólico", "Vitamina K", "Antioxidantes"]
    },
    {
      id: 6,
      nombre: "Pimientos Tricolores",
      precio: "$1,500 CLP por kilo",
      precioNumerico: 1500,
      stock: "120 kilos",
      descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados.",
      descripcionLarga: "Una mezcla perfecta de pimientos rojos, amarillos y verdes que aportan color, sabor y nutrientes a tus comidas. Cada color ofrece un perfil nutricional único, siendo los rojos los más ricos en vitamina C y antioxidantes. Perfectos para salteados, asados o ensaladas.",
      imagen: pimientosImg,
      categoria: "verduras",
      alt: "Pimientos Tricolores",
      origen: "Región de Valparaíso, Chile",
      beneficios: ["Vitamina C", "Antioxidantes", "Capsaicina", "Fibra natural"]
    },
    {
      id: 7,
      nombre: "Miel Orgánica",
      precio: "$5,000 CLP por frasco de 500g",
      precioNumerico: 5000,
      stock: "50 frascos",
      descripcion: "Miel pura y orgánica producida por apicultores locales.",
      descripcionLarga: "Miel 100% pura y orgánica, cosechada por apicultores locales que siguen prácticas sostenibles y respetuosas con las abejas. Sin aditivos ni procesamiento industrial, conserva todas sus propiedades naturales, enzimas y antioxidantes. Perfecta para endulzar naturalmente o como remedio casero.",
      imagen: mielImg,
      categoria: "organicos",
      alt: "Miel Orgánica",
      origen: "Región de Los Ríos, Chile",
      beneficios: ["Antibacteriana natural", "Antioxidantes", "Enzimas activas", "Energía natural"]
    },
    {
      id: 8,
      nombre: "Quinua Orgánica",
      precio: "$3,500 CLP por bolsa de 500g",
      precioNumerico: 3500,
      stock: "60 bolsas",
      descripcion: "Quinua orgánica de alto valor nutricional.",
      descripcionLarga: "La quinua orgánica es considerada un superalimento por su perfil nutricional completo. Contiene todos los aminoácidos esenciales, convirtiéndola en una proteína completa de origen vegetal. Cultivada siguiendo métodos orgánicos tradicionales, es libre de gluten y perfecta para dietas veganas y vegetarianas.",
      imagen: quinoaImg,
      categoria: "organicos",
      alt: "Quinua Orgánica",
      origen: "Altiplano, Bolivia",
      beneficios: ["Proteína completa", "Sin gluten", "Fibra alta", "Minerales esenciales"]
    },
    {
      id: 9,
      nombre: "Leche Fresca",
      precio: "$1,200 CLP por litro",
      precioNumerico: 1200,
      stock: "30 litros",
      descripcion: "Leche fresca de vacas de pastoreo libre.",
      descripcionLarga: "Leche fresca proveniente de vacas que pastan libremente en campos naturales. Nuestros productores garantizan el bienestar animal y prácticas sostenibles. Rica en calcio, proteínas y vitaminas, es procesada mínimamente para conservar su sabor natural y propiedades nutricionales.",
      imagen: lecheImg,
      categoria: "lacteos",
      alt: "Leche Fresca",
      origen: "Región de Los Lagos, Chile",
      beneficios: ["Alto contenido de calcio", "Proteínas completas", "Vitamina D", "Pastoreo libre"]
    }
  ];

  useEffect(() => {
    const productoEncontrado = productos.find(p => p.id === parseInt(id));
    if (productoEncontrado) {
      setProducto(productoEncontrado);
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    // Aquí implementarías la lógica del carrito
    alert(`Agregado al carrito: ${cantidad}x ${producto.nombre}`);
  };

  if (loading) {
    return (
      <main className="main" style={{ padding: '100px 5%', textAlign: 'center' }}>
        <div>Cargando producto...</div>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="main" style={{ padding: '100px 5%', textAlign: 'center' }}>
        <h1>Producto no encontrado</h1>
        <Link to="/productos" style={{ color: '#4caf50', textDecoration: 'none' }}>
          ← Volver a productos
        </Link>
      </main>
    );
  }

  return (
    <main className="main">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%' }}>
        
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '40px', fontSize: '0.9rem', color: '#666' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <Link to="/productos" style={{ color: '#666', textDecoration: 'none' }}>Productos</Link>
          <span style={{ margin: '0 10px' }}>/</span>
          <span>{producto.nombre}</span>
        </nav>

        {/* Contenido principal */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '60px',
          alignItems: 'start'
        }}>
          
          {/* Imagen del producto */}
          <div>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <img 
                src={producto.imagen} 
                alt={producto.alt}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* Información del producto */}
          <div>
            {/* Título y precio */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '10px',
                color: '#2e7d32',
                fontWeight: '300'
              }}>
                {producto.nombre}
              </h1>
              <div style={{ 
                fontSize: '1.8rem', 
                color: '#4caf50',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {producto.precio}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                Stock disponible: {producto.stock}
              </div>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '30px' }}>
              <p style={{ 
                lineHeight: '1.6', 
                color: '#555',
                fontSize: '1.1rem',
                marginBottom: '20px'
              }}>
                {producto.descripcionLarga}
              </p>
            </div>

            {/* Información adicional */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#2e7d32' }}>
                  Origen
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {producto.origen}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#2e7d32' }}>
                  Categoría
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem',
                  textTransform: 'capitalize'
                }}>
                  {producto.categoria}
                </p>
              </div>
            </div>

            {/* Selector de cantidad y botón */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.9rem', color: '#666' }}>Cantidad:</label>
                <select 
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddToCart}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
              >
                Agregar al carrito
              </button>
            </div>

            {/* Enlaces de navegación */}
            <div style={{ 
              display: 'flex',
              gap: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4caf50',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline'
                }}
              >
                ← Volver
              </button>
              <Link 
                to="/productos"
                style={{
                  color: '#4caf50',
                  textDecoration: 'underline',
                  fontSize: '0.9rem'
                }}
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductoSingle;