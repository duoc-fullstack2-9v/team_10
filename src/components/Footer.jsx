import '../assets/main.css';
import FooterColumn from './FooterColumn';

function Footer() {
  // Datos de navegación
  const navigationLinks = [
    { text: "Home", url: "/", isRouter: true },
    { text: "Productos", url: "/productos", isRouter: true },
    { text: "Nosotros", url: "/nosotros", isRouter: true },
    { text: "Blogs", url: "/blogs", isRouter: true },
    { text: "Contacto", url: "/contacto", isRouter: true }
  ];

  // Datos de contacto
  const contactInfo = [
    { text: "contacto@huertohogar.cl", url: "mailto:contacto@huertohogar.cl" },
    { text: "+56 9 1234 5678", url: "tel:+56912345678" },
    { text: "Santiago, Chile" }
  ];

  // Datos de redes sociales
  const socialLinks = [
    { name: "Instagram", url: "#", label: "Instagram" },
    { name: "Facebook", url: "#", label: "Facebook" },
    { name: "X / Twitter", url: "#", label: "X" }
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <FooterColumn 
          isLogo={true}
          description="Frescura del campo, directo a tu mesa. Productos locales y sostenibles."
        />
        
        <FooterColumn 
          title="Enlaces"
          content={navigationLinks}
        />
        
        <FooterColumn 
          title="Contacto"
          content={contactInfo}
        />
        
        <FooterColumn 
          type="social"
          title="Síguenos"
          content={socialLinks}
        />
      </div>

      <div className="footer-bottom">
        <p>© <span>2025</span> HuertoHogar · Vive saludable, compra local.</p>
      </div>
    </footer>
  );
}

export default Footer;
