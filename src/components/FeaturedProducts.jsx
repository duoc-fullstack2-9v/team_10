import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductoService from '../services/producto.service';
import espinacasImg from '../assets/img/prod/espinacas-frescas.png';
import manzanaImg from '../assets/img/prod/manzana-funji.png';
import mielImg from '../assets/img/prod/miel-organica.png';
import naranjasImg from '../assets/img/prod/naranjas-valencia.png';
import pimientosImg from '../assets/img/prod/pimientos-tricolores.png';
import platanosImg from '../assets/img/prod/platanos-cavendish.png';

function FeaturedProducts({ 
  title = "Productos destacados",
  products = null 
}) {
  const [productosAPI, setProductosAPI] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productos = await ProductoService.listarProductos();
      // Tomar solo los primeros 6 productos
      setProductosAPI(productos.slice(0, 6));
    } catch (error) {
      console.error('Error cargando productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };
  // Productos por defecto si no se pasan props
  const defaultProducts = [
    {
      id: 1,
      image: espinacasImg,
      name: "Espinacas Frescas",
      price: "$700 CLP por bolsa de 500g",
      alt: "Producto 1"
    },
    {
      id: 2,
      image: manzanaImg,
      name: "Manzana Fuji",
      price: "$1,200 CLP por kilo",
      alt: "Producto 2"
    },
    {
      id: 3,
      image: mielImg,
      name: "Miel Orgánica",
      price: "$5,000 CLP por frasco de 500g",
      alt: "Producto 3"
    },
    {
      id: 4,
      image: naranjasImg,
      name: "Naranjas Valencia",
      price: "$1,000 CLP por kilo",
      alt: "Producto 4"
    },
    {
      id: 5,
      image: pimientosImg,
      name: "Pimientos Tricolores",
      price: "$1,500 CLP por kilo",
      alt: "Producto 5"
    },
    {
      id: 6,
      image: platanosImg,
      name: "Plátanos Cavendish",
      price: "$800 CLP por kilo",
      alt: "Producto 6"
    }
  ];

  // Si se pasan products por props, usarlos; si no, usar productos de API; fallback a productos por defecto
  const productsToShow = products || (productosAPI.length > 0 ? productosAPI : defaultProducts);

  return (
    <section>
      <div className="catalogo">
        <h2 className="catalogo-title">{title}</h2>
        
        {loading && !products && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando productos destacados...</p>
          </div>
        )}
        
        <div className="product-grid">
          {productsToShow.map(product => (
            <ProductCard
              key={product.idProducto || product.id}
              product={product.idProducto ? product : null}
              image={product.image}
              name={product.name || product.nombre}
              price={product.price || `$${product.precio} CLP`}
              alt={product.alt || product.nombre}
              stock={product.stock}
              description={product.description || product.descripcion}
              showStock={product.showStock}
              showDescription={product.showDescription}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;