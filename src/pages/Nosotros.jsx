import './Home.css';

function Nosotros() {
  return (
    <main className="main">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 5%' }}>
        
        {/* Título principal */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '30px',
          color: '#2e7d32',
          fontWeight: '300',
          textAlign: 'center'
        }}>
          Nosotros
        </h1>

        {/* Contenido minimalista */}
        <div style={{ 
          display: 'grid', 
          gap: '40px',
          textAlign: 'center'
        }}>
          
          {/* Descripción principal */}
          <p style={{ 
            fontSize: '1.2rem',
            lineHeight: '1.6',
            color: '#555',
            margin: '0'
          }}>
            Cultivamos productos frescos y orgánicos para tu hogar desde 2020.
          </p>

          {/* Separador visual */}
          <div style={{ 
            width: '60px',
            height: '2px',
            backgroundColor: '#4caf50',
            margin: '0 auto'
          }}></div>

          {/* Misión simple */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              color: '#2e7d32',
              marginBottom: '15px',
              fontWeight: '400'
            }}>
              Nuestra Misión
            </h2>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              Conectar familias con productos de calidad, 
              cultivados de forma sustentable.
            </p>
          </div>

          {/* Valores en línea */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            margin: '20px 0'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</div>
              <span style={{ color: '#2e7d32', fontSize: '0.9rem' }}>Orgánico</span>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚚</div>
              <span style={{ color: '#2e7d32', fontSize: '0.9rem' }}>Entrega Rápida</span>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💚</div>
              <span style={{ color: '#2e7d32', fontSize: '0.9rem' }}>Sustentable</span>
            </div>
          </div>

          {/* Estadística simple */}
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '8px'
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              color: '#4caf50',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              10,000+
            </div>
            <p style={{ 
              color: '#666', 
              fontSize: '0.9rem',
              margin: '0'
            }}>
              Familias que confían en nosotros
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}

export default Nosotros;