import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import FooterColumn from '../src/components/FooterColumn';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Componente FooterColumn', () => {
  const mockLinksContent = [
    { text: 'Inicio', url: '/', isRouter: true },
    { text: 'Productos', url: '/productos', isRouter: true },
    { text: 'Contacto', url: '/contacto', isRouter: true }
  ];

  const mockSocialContent = [
    { name: 'Facebook', url: 'https://facebook.com', label: 'Facebook' },
    { name: 'Instagram', url: 'https://instagram.com', label: 'Instagram' }
  ];

  it('renderiza columna de enlaces correctamente', () => {
    renderWithRouter(
      <FooterColumn 
        type="links"
        title="Enlaces"
        content={mockLinksContent}
      />
    );

    expect(screen.getByText('Enlaces')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('renderiza columna social correctamente', () => {
    renderWithRouter(
      <FooterColumn 
        type="social"
        title="Síguenos"
        content={mockSocialContent}
      />
    );

    expect(screen.getByText('Síguenos')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    
    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
  });

  it('renderiza columna logo correctamente', () => {
    renderWithRouter(
      <FooterColumn 
        isLogo={true}
        description="Tu tienda de productos orgánicos"
      />
    );

    expect(screen.getByText('Huerto')).toBeInTheDocument();
    expect(screen.getByText('Hogar')).toBeInTheDocument();
    expect(screen.getByText('Tu tienda de productos orgánicos')).toBeInTheDocument();
    
    const logoLink = screen.getByRole('link', { name: /huerto.*hogar/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('tiene la estructura CSS correcta para enlaces', () => {
    renderWithRouter(
      <FooterColumn 
        type="links"
        title="Enlaces"
        content={mockLinksContent}
      />
    );

    const column = screen.getByRole('navigation');
    expect(column).toHaveClass('footer-col');
    
    const title = screen.getByText('Enlaces');
    expect(title).toHaveClass('footer-title');
    
    const linksList = screen.getByRole('list');
    expect(linksList).toHaveClass('footer-links');
  });

  it('tiene la estructura CSS correcta para social', () => {
    renderWithRouter(
      <FooterColumn 
        type="social"
        title="Síguenos"
        content={mockSocialContent}
      />
    );

    const column = screen.getByText('Síguenos').closest('.footer-col');
    expect(column).toHaveClass('footer-col');
    
    const socialContainer = screen.getByLabelText('Facebook').closest('.footer-social');
    expect(socialContainer).toHaveClass('footer-social');
  });

  it('tiene la estructura CSS correcta para logo', () => {
    renderWithRouter(
      <FooterColumn 
        isLogo={true}
        description="Descripción test"
      />
    );

    const column = screen.getByText('Descripción test').closest('.footer-col');
    expect(column).toHaveClass('footer-col');
    
    const logo = screen.getByRole('link', { name: /huerto.*hogar/i });
    expect(logo).toHaveClass('footer-logo');
    
    const description = screen.getByText('Descripción test');
    expect(description).toHaveClass('footer-text');
  });

  it('maneja contenido vacío sin errores', () => {
    renderWithRouter(
      <FooterColumn 
        type="links"
        title="Enlaces Vacíos"
        content={[]}
      />
    );

    expect(screen.getByText('Enlaces Vacíos')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renderiza enlaces externos correctamente', () => {
    const externalLinks = [
      { text: 'Sitio Externo', url: 'https://external.com', isRouter: false }
    ];

    renderWithRouter(
      <FooterColumn 
        type="links"
        title="Enlaces Externos"
        content={externalLinks}
      />
    );

    const externalLink = screen.getByText('Sitio Externo');
    expect(externalLink.closest('a')).toHaveAttribute('href', 'https://external.com');
  });
});