import { useState } from 'react';
import '../assets/main.css';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import CategoryDescription from '../components/CategoryDescription';

import manzanaImg from '../assets/img/prod/manzana-funji.png';
import naranjasImg from '../assets/img/prod/naranjas-valencia.png';
import platanosImg from '../assets/img/prod/platanos-cavendish.png';
import zanahoriasImg from '../assets/img/prod/zanahorias-organicas.png';
import espinacasImg from '../assets/img/prod/espinacas-frescas.png';
import pimientosImg from '../assets/img/prod/pimientos-tricolores.png';
import mielImg from '../assets/img/prod/miel-organica.png';
import quinoaImg from '../assets/img/quinoa.jpg';
import lecheImg from '../assets/img/leche.jpg';

function Productos() {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');


  const productos = [
    {
      id: 1,
      nombre: "Manzanas Fuji",
      precio: "$1,200 CLP por kilo",
      stock: "150 kilos",
      descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
      imagen: manzanaImg,
      categoria: "frutas",
      alt: "Manzanas Fuji"
    },
    {
      id: 2,
      nombre: "Naranjas Valencia",
      precio: "$1,000 CLP por kilo",
      stock: "200 kilos",
      descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos.",
      imagen: naranjasImg,
      categoria: "frutas",
      alt: "Naranjas Valencia"
    },
    {
      id: 3,
      nombre: "Plátanos Cavendish",
      precio: "$800 CLP por kilo",
      stock: "250 kilos",
      descripcion: "Plátanos maduros y dulces, perfectos para el desayuno.",
      imagen: platanosImg,
      categoria: "frutas",
      alt: "Plátanos Cavendish"
    },
    {
      id: 4,
      nombre: "Zanahorias Orgánicas",
      precio: "$900 CLP por kilo",
      stock: "100 kilos",
      descripcion: "Zanahorias crujientes cultivadas sin pesticidas.",
      imagen: zanahoriasImg,
      categoria: "verduras",
      alt: "Zanahorias Orgánicas"
    },
    {
      id: 5,
      nombre: "Espinacas Frescas",
      precio: "$700 CLP por bolsa de 500g",
      stock: "80 bolsas",
      descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas.",
      imagen: espinacasImg,
      categoria: "verduras",
      alt: "Espinacas Frescas"
    },
    {
      id: 6,
      nombre: "Pimientos Tricolores",
      precio: "$1,500 CLP por kilo",
      stock: "120 kilos",
      descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados.",
      imagen: pimientosImg,
      categoria: "verduras",
      alt: "Pimientos Tricolores"
    },
    {
      id: 7,
      nombre: "Miel Orgánica",
      precio: "$5,000 CLP por frasco de 500g",
      stock: "50 frascos",
      descripcion: "Miel pura y orgánica producida por apicultores locales.",
      imagen: mielImg,
      categoria: "organicos",
      alt: "Miel Orgánica"
    },
    {
      id: 8,
      nombre: "Quinua Orgánica",
      precio: "$3,500 CLP por bolsa de 500g",
      stock: "60 bolsas",
      descripcion: "Quinua orgánica de alto valor nutricional.",
      imagen: quinoaImg,
      categoria: "organicos",
      alt: "Quinua Orgánica"
    },
    {
      id: 9,
      nombre: "Leche Entera",
      precio: "$1,200 CLP por litro",
      stock: "100 litros",
      descripcion: "Leche entera fresca proveniente de granjas locales.",
      imagen: lecheImg,
      categoria: "lacteos",
      alt: "Leche Entera"
    }
  ];


  const productosFiltrados = filtroCategoria === 'todas' 
    ? productos 
    : productos.filter(producto => producto.categoria === filtroCategoria);

  const handleFiltroChange = (event) => {
    setFiltroCategoria(event.target.value);
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
        <div className="product-grid">
          {productosFiltrados.map(producto => (
            <ProductCard
              key={producto.id}
              id={producto.id}
              image={producto.imagen}
              name={producto.nombre}
              price={producto.precio}
              alt={producto.alt}
              stock={producto.stock}
              description={producto.descripcion}
              showStock={true}
              showDescription={true}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Productos;