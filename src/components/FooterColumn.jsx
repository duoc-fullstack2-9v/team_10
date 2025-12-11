import { Link } from 'react-router-dom';

function FooterColumn({ 
  type = "links", 
  title, 
  content = [], 
  isLogo = false,
  logoText = "HuertoHogar",
  description = ""
}) {
  
  if (isLogo) {
    const handleLogoClick = (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    return (
      <div className="footer-col">
        <a 
          className="footer-logo" 
          href="#" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          Huerto<span>Hogar</span>
        </a>
        <p className="footer-text">{description}</p>
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="footer-col">
        <h3 className="footer-title">{title}</h3>
        <div className="footer-social">
          {content.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              aria-label={social.label}
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Default: links or contact
  return (
    <nav className="footer-col">
      <h3 className="footer-title">{title}</h3>
      <ul className="footer-links">
        {content.map((item, index) => (
          <li key={index}>
            {item.isRouter ? (
              <Link to={item.url}>{item.text}</Link>
            ) : item.url ? (
              <a href={item.url}>{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FooterColumn;