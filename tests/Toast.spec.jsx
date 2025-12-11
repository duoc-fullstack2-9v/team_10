import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../src/components/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders toast with success message', () => {
    const onClose = vi.fn();
    render(<Toast message="Operación exitosa" type="success" onClose={onClose} />);
    
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders toast with error message', () => {
    const onClose = vi.fn();
    render(<Toast message="Error al guardar" type="error" onClose={onClose} />);
    
    expect(screen.getByText('Error al guardar')).toBeInTheDocument();
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('renders toast with warning message', () => {
    const onClose = vi.fn();
    render(<Toast message="Advertencia" type="warning" onClose={onClose} />);
    
    expect(screen.getByText('Advertencia')).toBeInTheDocument();
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('renders toast with info message', () => {
    const onClose = vi.fn();
    render(<Toast message="Información" type="info" onClose={onClose} />);
    
    expect(screen.getByText('Información')).toBeInTheDocument();
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('does not render when message is empty', () => {
    const onClose = vi.fn();
    const { container } = render(<Toast message="" type="success" onClose={onClose} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<Toast message="Test message" type="success" onClose={onClose} />);
    
    const closeButton = container.querySelector('.toast-close');
    closeButton.click();
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after duration', () => {
    const onClose = vi.fn();
    render(<Toast message="Auto close" type="success" onClose={onClose} duration={3000} />);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(3000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-close if duration is 0', () => {
    const onClose = vi.fn();
    render(<Toast message="No auto close" type="success" onClose={onClose} duration={0} />);
    
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
  });
});
