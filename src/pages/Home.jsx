import { useState } from 'react';
import Main from '../components/Main';
import LogoAnimation from '../components/LogoAnimation';
import './Home.css';

function Home() {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {setShowAnimation(false);};
 
  return (
    <>
      {showAnimation && (
        <LogoAnimation 
          onAnimationComplete={handleAnimationComplete}
          duration={2000} // 2 segundos
        />
      )}
      <div className={`main-content ${showAnimation ? 'hidden' : 'visible'}`}>
        
        <Main />
      </div>
    </>
  );
}

export default Home;