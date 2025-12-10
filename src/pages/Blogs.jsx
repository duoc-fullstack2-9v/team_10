import { Link } from 'react-router-dom';

function Blogs() {
  const articulos = [
    {
      id: 1,
      titulo: 'Beneficios de consumir productos orgánicos',
      fecha: '5 de diciembre, 2025',
      extracto: 'Descubre cómo los alimentos orgánicos pueden mejorar tu salud y contribuir al cuidado del medio ambiente.',
      categoria: 'Salud'
    },
    {
      id: 2,
      titulo: 'Cómo conservar frutas y verduras frescas',
      fecha: '1 de diciembre, 2025',
      extracto: 'Tips prácticos para mantener tus productos frescos por más tiempo y reducir el desperdicio de alimentos.',
      categoria: 'Consejos'
    },
    {
      id: 3,
      titulo: 'Conoce a nuestros agricultores locales',
      fecha: '28 de noviembre, 2025',
      extracto: 'Historia de las familias que cultivan los productos que llegan a tu mesa con dedicación y pasión.',
      categoria: 'Comunidad'
    },
    {
      id: 4,
      titulo: 'Recetas de temporada con productos frescos',
      fecha: '25 de noviembre, 2025',
      extracto: 'Aprovecha los productos de temporada con estas deliciosas y nutritivas recetas para toda la familia.',
      categoria: 'Recetas'
    },
    {
      id: 5,
      titulo: 'La importancia del consumo local',
      fecha: '20 de noviembre, 2025',
      extracto: 'Por qué comprar productos locales beneficia a tu comunidad y reduce la huella de carbono.',
      categoria: 'Sostenibilidad'
    },
    {
      id: 6,
      titulo: 'Calendario de cosechas en Chile',
      fecha: '15 de noviembre, 2025',
      extracto: 'Conoce qué frutas y verduras están en su mejor momento según la época del año.',
      categoria: 'Información'
    }
  ];

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'Salud': return '#27ae60';
      case 'Consejos': return '#3498db';
      case 'Comunidad': return '#e67e22';
      case 'Recetas': return '#e74c3c';
      case 'Sostenibilidad': return '#16a085';
      case 'Información': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <main className="main">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '60px 5%' 
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px' 
        }}>
          <h1 style={{ 
            fontSize: '2.5em', 
            color: '#2c3e50', 
            marginBottom: '20px' 
          }}>
            Blog
          </h1>
          <p style={{ 
            fontSize: '1.2em', 
            color: '#7f8c8d', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.8' 
          }}>
            Consejos, recetas y noticias sobre alimentación saludable 
            y agricultura sostenible
          </p>
        </div>

        {/* Grid de artículos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '30px',
          marginBottom: '40px' 
        }}>
          {articulos.map(articulo => (
            <article 
              key={articulo.id}
              style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Imagen placeholder */}
              <div style={{ 
                height: '200px', 
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4em'
              }}>
                {articulo.categoria === 'Salud' && '🥗'}
                {articulo.categoria === 'Consejos' && '💡'}
                {articulo.categoria === 'Comunidad' && '👨‍🌾'}
                {articulo.categoria === 'Recetas' && '🍳'}
                {articulo.categoria === 'Sostenibilidad' && '🌍'}
                {articulo.categoria === 'Información' && '📅'}
              </div>

              {/* Contenido */}
              <div style={{ padding: '25px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px' 
                }}>
                  <span style={{ 
                    padding: '5px 12px', 
                    backgroundColor: getCategoriaColor(articulo.categoria),
                    color: 'white',
                    borderRadius: '15px',
                    fontSize: '0.8em',
                    fontWeight: '500'
                  }}>
                    {articulo.categoria}
                  </span>
                  <span style={{ 
                    fontSize: '0.85em', 
                    color: '#95a5a6' 
                  }}>
                    {articulo.fecha}
                  </span>
                </div>

                <h2 style={{ 
                  fontSize: '1.4em', 
                  color: '#2c3e50',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {articulo.titulo}
                </h2>

                <p style={{ 
                  color: '#7f8c8d',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontSize: '0.95em'
                }}>
                  {articulo.extracto}
                </p>

                <button
                  style={{
                    color: '#27ae60',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: '0.95em',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onClick={() => {
                    // En producción esto llevaría a la página del artículo
                    alert('Artículo en construcción. Próximamente disponible.');
                  }}
                >
                  Leer más →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa', 
          padding: '50px 30px', 
          borderRadius: '8px',
          marginTop: '40px'
        }}>
          <h2 style={{ 
            fontSize: '1.8em', 
            color: '#2c3e50',
            marginBottom: '15px' 
          }}>
            ¿Quieres estar al día?
          </h2>
          <p style={{ 
            fontSize: '1.1em', 
            color: '#7f8c8d',
            marginBottom: '25px' 
          }}>
            Explora nuestros productos frescos y orgánicos
          </p>
          <Link 
            to="/productos" 
            style={{ 
              display: 'inline-block',
              padding: '15px 40px', 
              backgroundColor: '#27ae60', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Blogs;
