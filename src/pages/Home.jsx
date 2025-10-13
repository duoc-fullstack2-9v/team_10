import { useState, useEffect } from 'react';
import Main from '../components/Main';
import huertoLogo from '../assets/img/huerto_logo.png';
import './Home.css';

function Home() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Ocultar la animación después de 3.5 segundos
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showAnimation && (
        <div className="logo-animation-overlay">
          <div className="logo-animation-container">
            <img 
              src={huertoLogo} 
              alt="Huerto Hogar Logo" 
              className="logo-animation"
            />
            <h2 className="logo-text-animation">Huerto Hogar</h2>
          </div>
        </div>
      )}
      <div className={`main-content ${showAnimation ? 'hidden' : 'visible'}`}>
        <Main />
      </div>
    </>
  );
}

export default Home;