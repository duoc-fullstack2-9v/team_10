import { Link } from 'react-router-dom';

function Nosotros() {
  return (
    <main className="main">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '60px 5%' 
      }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px' 
        }}>
          <h1 style={{ 
            fontSize: '2.5em', 
            color: '#2c3e50', 
            marginBottom: '20px' 
          }}>
            Sobre Huerto Hogar
          </h1>
          <p style={{ 
            fontSize: '1.2em', 
            color: '#7f8c8d', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.8' 
          }}>
            Conectamos a pequeños agricultores locales con tu hogar, 
            llevándote productos frescos y orgánicos directamente desde la huerta.
          </p>
        </div>

        {/* Misión y Visión */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '40px', 
          marginBottom: '60px' 
        }}>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '40px', 
            borderRadius: '8px',
            borderLeft: '4px solid #27ae60' 
          }}>
            <h2 style={{ 
              color: '#27ae60', 
              fontSize: '1.8em', 
              marginBottom: '20px' 
            }}>
              Nuestra Misión
            </h2>
            <p style={{ 
              color: '#2c3e50', 
              lineHeight: '1.8', 
              fontSize: '1em' 
            }}>
              Facilitar el acceso a productos agrícolas frescos y de calidad, 
              apoyando a agricultores locales y promoviendo una alimentación 
              saludable y sostenible en cada hogar chileno.
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '40px', 
            borderRadius: '8px',
            borderLeft: '4px solid #3498db' 
          }}>
            <h2 style={{ 
              color: '#3498db', 
              fontSize: '1.8em', 
              marginBottom: '20px' 
            }}>
              Nuestra Visión
            </h2>
            <p style={{ 
              color: '#2c3e50', 
              lineHeight: '1.8', 
              fontSize: '1em' 
            }}>
              Ser la plataforma líder en comercio directo de productos agrícolas 
              en Chile, creando una red sólida entre productores y consumidores 
              que valore la frescura, calidad y origen local.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2em', 
            color: '#2c3e50', 
            marginBottom: '40px' 
          }}>
            Nuestros Valores
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px' 
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '30px' 
            }}>
              <div style={{ 
                fontSize: '3em', 
                marginBottom: '15px' 
              }}>
                🌱
              </div>
              <h3 style={{ 
                color: '#27ae60', 
                marginBottom: '10px' 
              }}>
                Sostenibilidad
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: '1.6' 
              }}>
                Promovemos prácticas agrícolas responsables con el medio ambiente
              </p>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '30px' 
            }}>
              <div style={{ 
                fontSize: '3em', 
                marginBottom: '15px' 
              }}>
                🤝
              </div>
              <h3 style={{ 
                color: '#27ae60', 
                marginBottom: '10px' 
              }}>
                Comercio Justo
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: '1.6' 
              }}>
                Garantizamos precios justos para agricultores y consumidores
              </p>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '30px' 
            }}>
              <div style={{ 
                fontSize: '3em', 
                marginBottom: '15px' 
              }}>
                ✓
              </div>
              <h3 style={{ 
                color: '#27ae60', 
                marginBottom: '10px' 
              }}>
                Calidad
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: '1.6' 
              }}>
                Seleccionamos cuidadosamente cada producto que ofrecemos
              </p>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '30px' 
            }}>
              <div style={{ 
                fontSize: '3em', 
                marginBottom: '15px' 
              }}>
                💚
              </div>
              <h3 style={{ 
                color: '#27ae60', 
                marginBottom: '10px' 
              }}>
                Transparencia
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: '1.6' 
              }}>
                Conoce el origen y la historia detrás de cada producto
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          textAlign: 'center', 
          backgroundColor: '#27ae60', 
          padding: '50px 30px', 
          borderRadius: '8px',
          color: 'white' 
        }}>
          <h2 style={{ 
            fontSize: '2em', 
            marginBottom: '20px' 
          }}>
            ¿Listo para empezar?
          </h2>
          <p style={{ 
            fontSize: '1.1em', 
            marginBottom: '30px',
            color: 'white',
            opacity: 0.95 
          }}>
            Descubre nuestra selección de productos frescos y orgánicos
          </p>
          <Link 
            to="/productos" 
            style={{ 
              display: 'inline-block',
              padding: '15px 40px', 
              backgroundColor: 'white', 
              color: '#27ae60', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Nosotros;
