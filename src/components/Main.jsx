import '../assets/main.css';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';

function Main(props) {
  return (
    <main className="main">
      <HeroSection />
      <FeaturedProducts />
    </main>
  );
}

export default Main;