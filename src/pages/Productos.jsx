import { useState } from 'react';
import '../assets/main.css';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import CategoryDescription from '../components/CategoryDescription';
import { useProductos } from '../hooks/useProductos';

function Productos() {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const { productos: productosAPI, loading, error, filtrarPorCategoria, cargarProductos } = useProductos();


  // Mapear categorías de la API a las del filtro
  const mapearCategoriaFiltro = (categoriaAPI) => {
    const mapeo = {
      'Frutas': 'frutas',
      'Verduras': 'verduras',
      'Otros': 'organicos',
      'Hierbas': 'organicos'
    };
    return mapeo[categoriaAPI] || 'organicos';
  };

  // Filtrar productos de la API
  const productosFiltrados = filtroCategoria === 'todas' 
    ? productosAPI 
    : productosAPI.filter(producto => 
        mapearCategoriaFiltro(producto.categoria) === filtroCategoria
      );

  const handleFiltroChange = (event) => {
    const categoria = event.target.value;
    setFiltroCategoria(categoria);
    
    // Si selecciona una categoría específica, usar el filtro de la API
    if (categoria !== 'todas') {
      if (categoria === 'frutas') {
        filtrarPorCategoria('Frutas');
      } else if (categoria === 'verduras') {
        filtrarPorCategoria('Verduras');
      } else {
        cargarProductos(); // Cargar todos y filtrar localmente
      }
    } else {
      cargarProductos();
    }
  };

  // Datos de categorías
  const categorias = [
    { emoji: "🍎", name: "Frutas Frescas", category: "frutas" },
    { emoji: "🥕", name: "Verduras Orgánicas", category: "verduras" },
    { emoji: "🌱", name: "Productos Orgánicos", category: "organicos" },
    { emoji: "🥛", name: "Productos Lácteos", category: "lacteos" }
  ];

  // Descripciones de categorías
  const descripciones = [
    {
      title: "Frutas Frescas",
      description: "Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies."
    },
    {
      title: "Verduras Orgánicas",
      description: "Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible."
    },
    {
      title: "Productos Orgánicos",
      description: "Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad."
    },
    {
      title: "Productos Lácteos",
      description: "Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia."
    }
  ];

  return (
    <main className="main">
      <section>
        <div className="productos-hero">
          <h1>
            <span className="emoji-titulo">🥑</span>
            Categorías y Productos de <span className="huerto-color">HuertoHogar</span>
          </h1>
          <p className="productos-hero-desc">
            Descubre la mejor selección de productos frescos, orgánicos y saludables para tu hogar.
          </p>
        </div>
        
        <div className="categorias-grid">
          {categorias.map((categoria, index) => (
            <CategoryCard
              key={index}
              emoji={categoria.emoji}
              name={categoria.name}
              category={categoria.category}
            />
          ))}
        </div>
        
        <div className="descripcion-categorias-grid">
          {descripciones.map((desc, index) => (
            <CategoryDescription
              key={index}
              title={desc.title}
              description={desc.description}
            />
          ))}
        </div>
      </section>

      <section>
        <h2>🥑 Listado de Productos</h2>
        <div className="filtros-productos">
          <label htmlFor="filtro-categoria"><strong>Filtrar por categoría:</strong></label>
          <select id="filtro-categoria" value={filtroCategoria} onChange={handleFiltroChange}>
            <option value="todas">Todas</option>
            <option value="frutas">Frutas Frescas</option>
            <option value="verduras">Verduras Orgánicas</option>
            <option value="organicos">Productos Orgánicos</option>
            <option value="lacteos">Productos Lácteos</option>
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando productos...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fee', 
            color: '#c00',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <p>❌ Error al cargar productos: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="product-grid">
            {productosFiltrados.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                No se encontraron productos en esta categoría
              </p>
            ) : (
              productosFiltrados.map(producto => (
                <ProductCard
                  key={producto.idProducto}
                  product={producto}
                />
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Productos;