import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryDescription from '../src/components/CategoryDescription';

describe('Componente CategoryDescription', () => {
  const mockProps = {
    title: 'Productos Orgánicos',
    description: 'Los mejores productos orgánicos para tu huerto casero'
  };

  it('renderiza correctamente con props básicas', () => {
    render(
      <CategoryDescription 
        title={mockProps.title}
        description={mockProps.description}
      />
    );

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('tiene la estructura HTML correcta', () => {
    render(
      <CategoryDescription 
        title={mockProps.title}
        description={mockProps.description}
      />
    );

    const container = screen.getByText(mockProps.title).closest('.desc-cat-card');
    expect(container).toBeInTheDocument();
    
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toHaveTextContent(mockProps.title);
    
    const descriptionElement = screen.getByText(mockProps.description);
    expect(descriptionElement.tagName).toBe('P');
  });

  it('renderiza con props vacías sin errores', () => {
    render(<CategoryDescription title="" description="" />);
    
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    
    // Verificar que el componente se renderiza sin errores
    const container = screen.getByRole('heading', { level: 3 }).closest('.desc-cat-card');
    expect(container).toBeInTheDocument();
  });

  it('renderiza solo con título', () => {
    render(<CategoryDescription title="Solo Título" />);
    
    expect(screen.getByText('Solo Título')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('aplica la clase CSS correcta', () => {
    render(
      <CategoryDescription 
        title={mockProps.title}
        description={mockProps.description}
      />
    );

    const container = screen.getByText(mockProps.title).closest('.desc-cat-card');
    expect(container).toHaveClass('desc-cat-card');
  });
});