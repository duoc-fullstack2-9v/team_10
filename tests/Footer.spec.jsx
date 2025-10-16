import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../src/components/Footer";

// Mock del componente FooterColumn
vi.mock("../src/components/FooterColumn", () => ({
  default: ({ title, content, isLogo, description }) => (
    <div data-testid={`footer-column-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'logo'}`}>
      {isLogo ? (
        <div>{description}</div>
      ) : (
        <>
          <h3>{title}</h3>
          {content && content.map((link, index) => (
            <div key={index}>{link.text || link.name}</div>
          ))}
        </>
      )}
    </div>
  )
}));

// Componente wrapper para pruebas
const FooterWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe("Componente Footer", () => {
  it("renderiza el elemento footer correctamente", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass("footer");
  });

  it("renderiza la columna de navegación", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const navigationColumn = screen.getByTestId("footer-column-enlaces");
    expect(navigationColumn).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Nosotros")).toBeInTheDocument();
    expect(screen.getByText("Blogs")).toBeInTheDocument();
    // Usar getAllByText para elementos que aparecen múltiples veces
    expect(screen.getAllByText("Contacto").length).toBeGreaterThan(0);
  });

  it("renderiza la columna de contacto", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const contactColumn = screen.getByTestId("footer-column-contacto");
    expect(contactColumn).toBeInTheDocument();
    expect(screen.getByText("contacto@huertohogar.cl")).toBeInTheDocument();
    expect(screen.getByText("+56 9 1234 5678")).toBeInTheDocument();
    expect(screen.getByText("Santiago, Chile")).toBeInTheDocument();
  });

  it("renderiza la columna de redes sociales", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const socialColumn = screen.getByTestId("footer-column-síguenos");
    expect(socialColumn).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("X / Twitter")).toBeInTheDocument();
  });

  it("renderiza la sección de copyright", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    // Verificar que existe la sección footer-bottom con copyright
    const footerBottom = document.querySelector(".footer-bottom");
    expect(footerBottom).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText(/HuertoHogar/)).toBeInTheDocument();
  });

  it("tiene la estructura correcta de contenedor", () => {
    render(
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    );
    
    const footer = screen.getByRole("contentinfo");
    const footerInner = footer.querySelector(".footer-inner");
    expect(footerInner).toBeInTheDocument();
  });
});