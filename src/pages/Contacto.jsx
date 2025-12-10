import { useState } from 'react';
import Toast from '../components/Toast';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [toast, setToast] = useState({ message: '', type: '' });
  const [enviando, setEnviando] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Por favor ingresa un email válido', 'error');
      return;
    }

    setEnviando(true);
    
    // Simular envío (en producción esto llamaría a tu API)
    setTimeout(() => {
      showToast('Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
      setEnviando(false);
    }, 1000);
  };

  return (
    <main className="main">
      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: '', type: '' })} 
        />
      )}

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
            Contáctanos
          </h1>
          <p style={{ 
            fontSize: '1.2em', 
            color: '#7f8c8d', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.8' 
          }}>
            ¿Tienes preguntas o sugerencias? Nos encantaría escucharte. 
            Completa el formulario y te responderemos a la brevedad.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '60px' 
        }}>
          {/* Formulario */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '40px', 
            borderRadius: '8px' 
          }}>
            <h2 style={{ 
              color: '#2c3e50', 
              marginBottom: '30px', 
              fontSize: '1.8em' 
            }}>
              Envíanos un mensaje
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Asunto
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#2c3e50',
                  fontWeight: '500' 
                }}>
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: enviando ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div>
            <h2 style={{ 
              color: '#2c3e50', 
              marginBottom: '30px', 
              fontSize: '1.8em' 
            }}>
              Información de contacto
            </h2>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '25px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '1.5em', 
                  marginRight: '15px',
                  color: '#27ae60' 
                }}>
                  📍
                </div>
                <div>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    marginBottom: '5px',
                    fontSize: '1.1em' 
                  }}>
                    Dirección
                  </h3>
                  <p style={{ 
                    color: '#7f8c8d', 
                    lineHeight: '1.6',
                    margin: 0 
                  }}>
                    Av. Libertador Bernardo O'Higgins 1234<br />
                    Santiago, Región Metropolitana
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '25px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '1.5em', 
                  marginRight: '15px',
                  color: '#27ae60' 
                }}>
                  📧
                </div>
                <div>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    marginBottom: '5px',
                    fontSize: '1.1em' 
                  }}>
                    Email
                  </h3>
                  <p style={{ 
                    color: '#7f8c8d', 
                    lineHeight: '1.6',
                    margin: 0 
                  }}>
                    contacto@huertohogar.cl<br />
                    ventas@huertohogar.cl
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '1.5em', 
                  marginRight: '15px',
                  color: '#27ae60' 
                }}>
                  📞
                </div>
                <div>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    marginBottom: '5px',
                    fontSize: '1.1em' 
                  }}>
                    Teléfono
                  </h3>
                  <p style={{ 
                    color: '#7f8c8d', 
                    lineHeight: '1.6',
                    margin: 0 
                  }}>
                    +56 9 1234 5678<br />
                    +56 2 2345 6789
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#e8f5e9', 
              padding: '25px', 
              borderRadius: '8px',
              borderLeft: '4px solid #27ae60'
            }}>
              <h3 style={{ 
                color: '#27ae60', 
                marginBottom: '10px',
                fontSize: '1.2em' 
              }}>
                Horario de atención
              </h3>
              <p style={{ 
                color: '#2c3e50', 
                lineHeight: '1.8',
                margin: 0 
              }}>
                Lunes a Viernes: 9:00 - 18:00<br />
                Sábados: 10:00 - 14:00<br />
                Domingos: Cerrado
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contacto;
