import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Nav from "../src/components/Nav";

// Mock del contexto de autenticación
const mockAuthContext = {
  user: null,
  isAuthenticated: vi.fn(() => false),
  isAdmin: vi.fn(() => false),
  isVendedor: vi.fn(() => false),
  isCliente: vi.fn(() => false),
  logout: vi.fn(),
  getRoleName: vi.fn(() => "Usuario"),
  loading: false
};

vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockAuthContext
}));

// Mock de las imágenes
vi.mock("../src/assets/img/huerto_logo.png", () => ({
  default: "mock-logo.png"
}));

vi.mock("../src/assets/img/carro.png", () => ({
  default: "mock-carro.png"
}));

// Componente wrapper para pruebas
const NavWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe("Componente Nav", () => {
  beforeEach(() => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated.mockReturnValue(false);
    mockAuthContext.isAdmin.mockReturnValue(false);
  });

  it("renderiza el logo y el nombre de la tienda", () => {
    render(
      <NavWrapper>
        <Nav />
      </NavWrapper>
    );
    
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Huerto Hogar")).toBeInTheDocument();
  });

  it("renderiza los enlaces de navegación principales", () => {
    render(
      <NavWrapper>
        <Nav />
      </NavWrapper>
    );
    
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Nosotros")).toBeInTheDocument();
  });

  it("muestra botones de login/registro cuando no está autenticado", () => {
    render(
      <NavWrapper>
        <Nav />
      </NavWrapper>
    );
    
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByText("Registrar Usuario")).toBeInTheDocument();
  });

  it("permite alternar el menú móvil", () => {
    render(
      <NavWrapper>
        <Nav />
      </NavWrapper>
    );
    
    const menuToggle = screen.getByLabelText("Toggle menu");
    expect(menuToggle).toBeInTheDocument();
    
    // Verificar que inicialmente no tiene la clase active
    expect(menuToggle).not.toHaveClass("active");
    
    // Hacer clic y verificar que se agrega la clase active
    fireEvent.click(menuToggle);
    expect(menuToggle).toHaveClass("active");
  });

  it("renderiza el header con la clase navbar correcta", () => {
    render(
      <NavWrapper>
        <Nav />
      </NavWrapper>
    );
    
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("header");
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("navbar");
  });
});