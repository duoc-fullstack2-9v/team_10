import React from "react";
import { render, screen } from "@testing-library/react";
import HeroSection from "../src/components/HeroSection";

// Mock de las imágenes
vi.mock("../src/assets/img/main-principal-img.webp", () => ({
  default: "mock-hero-image.webp"
}));

vi.mock("../src/assets/img/fondo.jpeg", () => ({
  default: "mock-background.jpeg"
}));

describe("Componente HeroSection", () => {
  it("renderiza con las props por defecto", () => {
    render(<HeroSection />);
    
    expect(screen.getByText("Bienvenido a Huerto Hogar")).toBeInTheDocument();
    expect(screen.getByText("Tu tienda en línea para productos de jardinería y huertos urbanos.")).toBeInTheDocument();
    expect(screen.getByText("Comprar Ahora")).toBeInTheDocument();
    expect(screen.getByAltText("Huerto Hogar")).toBeInTheDocument();
  });

  it("renderiza con props personalizadas", () => {
    const customProps = {
      title: "Título Personalizado",
      description: "Descripción personalizada del sitio",
      buttonText: "Botón Personalizado",
      buttonLink: "/custom-link",
      heroImageAlt: "Imagen personalizada"
    };

    render(<HeroSection {...customProps} />);
    
    expect(screen.getByText("Título Personalizado")).toBeInTheDocument();
    expect(screen.getByText("Descripción personalizada del sitio")).toBeInTheDocument();
    expect(screen.getByText("Botón Personalizado")).toBeInTheDocument();
    expect(screen.getByAltText("Imagen personalizada")).toBeInTheDocument();
  });

  it("el botón tiene el enlace correcto", () => {
    render(<HeroSection buttonLink="/productos" buttonText="Ver Productos" />);
    
    const button = screen.getByText("Ver Productos");
    expect(button).toHaveAttribute("href", "/productos");
    expect(button).toHaveClass("shop-now-button");
  });

  it("renderiza la estructura correcta de elementos", () => {
    render(<HeroSection />);
    
    // Verificar que existe la sección principal
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
    
    // Verificar que existe el div principal con la clase correcta
    const principalDiv = section.querySelector(".principal");
    expect(principalDiv).toBeInTheDocument();
    
    // Verificar que existe el contenedor de texto
    const textContainer = section.querySelector(".title-text");
    expect(textContainer).toBeInTheDocument();
    
    // Verificar que existe el contenedor de imagen
    const imageContainer = section.querySelector(".principal-image");
    expect(imageContainer).toBeInTheDocument();
  });

  it("aplica el estilo de background correctamente", () => {
    render(<HeroSection />);
    
    const principalDiv = document.querySelector(".principal");
    expect(principalDiv).toHaveStyle({ 
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    });
  });
});