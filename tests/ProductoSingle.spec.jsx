import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductoSingle from "../src/pages/ProductoSingle";

// Mock de las imágenes
vi.mock("../src/assets/img/prod/manzana-funji.png", () => ({
  default: "mock-manzana.png"
}));

vi.mock("../src/assets/img/prod/naranjas-valencia.png", () => ({
  default: "mock-naranjas.png"
}));

vi.mock("../src/assets/img/prod/platanos-cavendish.png", () => ({
  default: "mock-platanos.png"
}));

vi.mock("../src/assets/img/prod/zanahorias-organicas.png", () => ({
  default: "mock-zanahorias.png"
}));

vi.mock("../src/assets/img/prod/espinacas-frescas.png", () => ({
  default: "mock-espinacas.png"
}));

vi.mock("../src/assets/img/prod/pimientos-tricolores.png", () => ({
  default: "mock-pimientos.png"
}));

vi.mock("../src/assets/img/prod/miel-organica.png", () => ({
  default: "mock-miel.png"
}));

vi.mock("../src/assets/img/quinoa.jpg", () => ({
  default: "mock-quinoa.jpg"
}));

vi.mock("../src/assets/img/leche.jpg", () => ({
  default: "mock-leche.jpg"
}));

// Mock de navegación
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

// Mock de window.alert
global.alert = vi.fn();

// Componente wrapper para pruebas
const ProductoSingleWrapper = ({ productId = "1" }) => (
  <MemoryRouter initialEntries={[`/producto/${productId}`]}>
    <ProductoSingle />
  </MemoryRouter>
);

describe("Página ProductoSingle", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.alert.mockClear();
  });

  it("renderiza la estructura básica del componente", () => {
    render(<ProductoSingleWrapper />);
    
    // Verificar que el componente renderiza la estructura principal
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renderiza el producto correctamente cuando se encuentra", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    // Verificar que se muestra la información del producto usando getByRole para el título
    expect(screen.getByRole("heading", { name: "Manzanas Fuji" })).toBeInTheDocument();
    expect(screen.getByText("$1,200 CLP por kilo")).toBeInTheDocument();
    expect(screen.getByText(/Stock disponible: 150 kilos/)).toBeInTheDocument();
  });

  it("muestra breadcrumb de navegación", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    // Verificar breadcrumb usando selectores más específicos
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    
    // Verificar que existe el breadcrumb navigation
    const breadcrumbNav = screen.getByRole("navigation");
    expect(breadcrumbNav).toBeInTheDocument();
  });

  it("muestra imagen del producto", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const imagen = screen.getByAltText("Manzanas Fuji");
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "mock-manzana.png");
  });

  it("permite seleccionar cantidad", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const selectCantidad = screen.getByDisplayValue("1");
    expect(selectCantidad).toBeInTheDocument();
    
    // Cambiar cantidad
    fireEvent.change(selectCantidad, { target: { value: "3" } });
    expect(selectCantidad.value).toBe("3");
  });

  it("permite agregar al carrito", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const botonAgregar = screen.getByText("Agregar al carrito");
    fireEvent.click(botonAgregar);
    
    expect(global.alert).toHaveBeenCalledWith("Agregado al carrito: 1x Manzanas Fuji");
  });

  it("muestra información adicional del producto", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    // Verificar información adicional
    expect(screen.getByText("Origen")).toBeInTheDocument();
    expect(screen.getByText("Valle del Maule, Chile")).toBeInTheDocument();
    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("frutas")).toBeInTheDocument();
  });

  it("permite navegar hacia atrás", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const botonVolver = screen.getByText("← Volver");
    fireEvent.click(botonVolver);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("muestra enlaces de navegación", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const enlaceProductos = screen.getByText("Ver todos los productos");
    expect(enlaceProductos).toBeInTheDocument();
    expect(enlaceProductos.closest('a')).toHaveAttribute('href', '/productos');
  });

  it("maneja productos válidos correctamente", async () => {
    render(<ProductoSingleWrapper productId="2" />);
    
    await waitFor(() => {
      // Verificar que se carga algún producto válido
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText("Agregar al carrito")).toBeInTheDocument();
    });
  });

  it("muestra descripción larga del producto", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    const descripcionLarga = screen.getByText(/Las manzanas Fuji son conocidas por su textura crujiente/);
    expect(descripcionLarga).toBeInTheDocument();
  });

  it("actualiza el carrito con la cantidad seleccionada", async () => {
    render(<ProductoSingleWrapper productId="1" />);
    
    await waitFor(() => {
      expect(screen.queryByText("Cargando producto...")).not.toBeInTheDocument();
    });

    // Cambiar cantidad a 5
    const selectCantidad = screen.getByDisplayValue("1");
    fireEvent.change(selectCantidad, { target: { value: "5" } });
    
    // Agregar al carrito
    const botonAgregar = screen.getByText("Agregar al carrito");
    fireEvent.click(botonAgregar);
    
    expect(global.alert).toHaveBeenCalledWith("Agregado al carrito: 5x Manzanas Fuji");
  });
});