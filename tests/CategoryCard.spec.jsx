import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryCard from '../src/components/CategoryCard';

describe('Componente CategoryCard', () => {
  const mockCategory = {
    emoji: '🍎',
    name: 'Frutas',
    category: 'frutas'
  };

  it('renderiza correctamente con todas las props', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
        category={mockCategory.category}
      />
    );

    expect(screen.getByText(mockCategory.emoji)).toBeInTheDocument();
    expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
  });

  it('aplica las clases CSS correctas', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
        category={mockCategory.category}
      />
    );

    const cardContainer = screen.getByText(mockCategory.name).closest('div');
    expect(cardContainer).toHaveClass('categoria-card');
    expect(cardContainer).toHaveClass(mockCategory.category);
  });

  it('renderiza el emoji con la clase correcta', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
        category={mockCategory.category}
      />
    );

    const emojiElement = screen.getByText(mockCategory.emoji);
    expect(emojiElement).toHaveClass('categoria-emoji');
  });

  it('renderiza el nombre con la clase correcta', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
        category={mockCategory.category}
      />
    );

    const nameElement = screen.getByText(mockCategory.name);
    expect(nameElement).toHaveClass('categoria-nombre');
  });

  it('funciona sin la prop category', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
      />
    );

    const cardContainer = screen.getByText(mockCategory.name).closest('div');
    expect(cardContainer).toHaveClass('categoria-card');
    expect(screen.getByText(mockCategory.emoji)).toBeInTheDocument();
    expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
  });

  it('maneja emojis diferentes correctamente', () => {
    const categories = [
      { emoji: '🥕', name: 'Verduras', category: 'verduras' },
      { emoji: '🥛', name: 'Lácteos', category: 'lacteos' },
      { emoji: '🌿', name: 'Orgánicos', category: 'organicos' }
    ];

    categories.forEach(cat => {
      const { unmount } = render(
        <CategoryCard
          emoji={cat.emoji}
          name={cat.name}
          category={cat.category}
        />
      );

      expect(screen.getByText(cat.emoji)).toBeInTheDocument();
      expect(screen.getByText(cat.name)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('mantiene la estructura HTML esperada', () => {
    render(
      <CategoryCard
        emoji={mockCategory.emoji}
        name={mockCategory.name}
        category={mockCategory.category}
      />
    );

    const cardContainer = screen.getByText(mockCategory.name).closest('div');
    const emojiSpan = screen.getByText(mockCategory.emoji);
    const nameSpan = screen.getByText(mockCategory.name);

    expect(cardContainer.children).toHaveLength(2);
    expect(cardContainer.children[0]).toBe(emojiSpan);
    expect(cardContainer.children[1]).toBe(nameSpan);
  });
});