import { useState, useEffect } from 'react';
import huertoLogo from '../assets/img/huerto_logo.png';
import './LogoAnimation.css';

function LogoAnimation({ onAnimationComplete, duration = 3500 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Llamar al callback después de que termine la animación de fade out
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 500); // 500ms es la duración del fadeOut
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
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
  );
}

export default LogoAnimation;