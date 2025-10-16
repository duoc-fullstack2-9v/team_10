import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../src/components/Main";

// Mock de los componentes hijos
vi.mock("../src/components/HeroSection", () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>
}));

vi.mock("../src/components/FeaturedProducts", () => ({
  default: () => <div data-testid="featured-products">Featured Products</div>
}));

describe("Componente Main", () => {
  it("renderiza el elemento main correctamente", () => {
    render(<Main />);
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass("main");
  });

  it("renderiza el componente HeroSection", () => {
    render(<Main />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  it("renderiza el componente FeaturedProducts", () => {
    render(<Main />);
    expect(screen.getByTestId("featured-products")).toBeInTheDocument();
  });

  it("tiene la estructura correcta de componentes", () => {
    render(<Main />);
    const mainElement = screen.getByRole("main");
    const heroSection = screen.getByTestId("hero-section");
    const featuredProducts = screen.getByTestId("featured-products");
    
    expect(mainElement).toContainElement(heroSection);
    expect(mainElement).toContainElement(featuredProducts);
  });
});