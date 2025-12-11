import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FooterColumn from '../src/components/FooterColumn';

describe('FooterColumn Component', () => {
  it('renders logo column with description', () => {
    render(
      <BrowserRouter>
        <FooterColumn 
          isLogo={true}
          description="Frescura del campo, directo a tu mesa"
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Huerto/)).toBeInTheDocument();
    expect(screen.getByText(/Hogar/)).toBeInTheDocument();
    expect(screen.getByText('Frescura del campo, directo a tu mesa')).toBeInTheDocument();
  });

  it('renders links column with navigation items', () => {
    const navigationLinks = [
      { text: "Home", url: "/", isRouter: true },
      { text: "Productos", url: "/productos", isRouter: true }
    ];

    render(
      <BrowserRouter>
        <FooterColumn 
          title="Enlaces"
          content={navigationLinks}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Enlaces')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('renders contact column with email and phone', () => {
    const contactInfo = [
      { text: "contacto@huertohogar.cl", url: "mailto:contacto@huertohogar.cl" },
      { text: "+56 9 1234 5678", url: "tel:+56912345678" },
      { text: "Santiago, Chile" }
    ];

    render(
      <BrowserRouter>
        <FooterColumn 
          title="Contacto"
          content={contactInfo}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('contacto@huertohogar.cl')).toBeInTheDocument();
    expect(screen.getByText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('Santiago, Chile')).toBeInTheDocument();
  });

  it('renders social links column', () => {
    const socialLinks = [
      { name: "Instagram", url: "#", label: "Instagram" },
      { name: "Facebook", url: "#", label: "Facebook" }
    ];

    render(
      <BrowserRouter>
        <FooterColumn 
          type="social"
          title="Síguenos"
          content={socialLinks}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Síguenos')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  it('logo link scrolls to top when clicked', async () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const { container } = render(
      <BrowserRouter>
        <FooterColumn 
          isLogo={true}
          description="Test description"
        />
      </BrowserRouter>
    );
    
    const logoLink = container.querySelector('.footer-logo');
    expect(logoLink).toBeInTheDocument();
    
    logoLink.click();
    
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('renders empty column when content is empty array', () => {
    render(
      <BrowserRouter>
        <FooterColumn 
          title="Vacío"
          content={[]}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Vacío')).toBeInTheDocument();
  });
});
