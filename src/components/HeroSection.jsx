import mainPrincipalImg from '../assets/img/main-principal-img.webp';
import fondoImg from '../assets/img/fondo.jpeg';

function HeroSection({ 
  title = "Bienvenido a Huerto Hogar", 
  description = "Tu tienda en línea para productos de jardinería y huertos urbanos.",
  buttonText = "Comprar Ahora",
  buttonLink = "#",
  backgroundImage = fondoImg,
  heroImage = mainPrincipalImg,
  heroImageAlt = "Huerto Hogar"
}) {
  return (
    <section>
      <div 
        className="principal"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="title-text principal-text">
          <h1>{title}</h1>
          <p>{description}</p>
          <a href={buttonLink} className="shop-now-button">{buttonText}</a>
        </div>
        <div className="principal-image">
          <img src={heroImage} alt={heroImageAlt} />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;