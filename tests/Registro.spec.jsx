import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Registro from '../src/pages/Registro';

// Mock de fetch para las llamadas API
global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Página Registro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  it('renderiza correctamente', () => {
    renderWithRouter(<Registro />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Registro de Usuario' })).toBeInTheDocument();
  });

  it('muestra todos los campos del formulario', () => {
    renderWithRouter(<Registro />);

    expect(screen.getByLabelText('Nombre Completo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Teléfono:')).toBeInTheDocument();
    expect(screen.getByLabelText('Región:')).toBeInTheDocument();
    expect(screen.getByLabelText('Comuna:')).toBeInTheDocument();
  });

  it('permite escribir en todos los campos de entrada', () => {
    renderWithRouter(<Registro />);

    const nombreInput = screen.getByLabelText('Nombre Completo:');
    const correoInput = screen.getByLabelText('Correo:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const telefonoInput = screen.getByLabelText('Teléfono:');

    fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(correoInput, { target: { value: 'juan@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(telefonoInput, { target: { value: '123456789' } });

    expect(nombreInput.value).toBe('Juan Pérez');
    expect(correoInput.value).toBe('juan@test.com');
    expect(passwordInput.value).toBe('password123');
    expect(telefonoInput.value).toBe('123456789');
  });

  it('valida campos requeridos', async () => {
    renderWithRouter(<Registro />);

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El correo es requerido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
      expect(screen.getByText('Debe confirmar la contraseña')).toBeInTheDocument();
      expect(screen.getByText('El teléfono es requerido')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar una región')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar una comuna')).toBeInTheDocument();
    });
  });

  it('permite cambiar el valor del correo', () => {
    renderWithRouter(<Registro />);

    const correoInput = screen.getByLabelText('Correo:');
    fireEvent.change(correoInput, { target: { value: 'test@example.com' } });
    
    expect(correoInput.value).toBe('test@example.com');
  });

  it('valida longitud mínima de contraseña', async () => {
    renderWithRouter(<Registro />);

    const passwordInput = screen.getByLabelText('Contraseña:');
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });

  it('valida que las contraseñas coincidan', async () => {
    renderWithRouter(<Registro />);

    const passwordInput = screen.getByLabelText('Contraseña:');
    const confirmarInput = screen.getByLabelText('Confirmar Contraseña:');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmarInput, { target: { value: 'password456' } });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('muestra las regiones en el select', () => {
    renderWithRouter(<Registro />);

    const regionSelect = screen.getByLabelText('Región:');
    
    expect(screen.getByRole('option', { name: 'Seleccione una región' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Metropolitana' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Valparaíso' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Antofagasta' })).toBeInTheDocument();
  });

  it('actualiza las comunas cuando se selecciona una región', () => {
    renderWithRouter(<Registro />);

    const regionSelect = screen.getByLabelText('Región:');
    fireEvent.change(regionSelect, { target: { value: 'metropolitana' } });

    expect(screen.getByRole('option', { name: 'Santiago' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Las Condes' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Providencia' })).toBeInTheDocument();
  });

  it('resetea la comuna cuando cambia la región', () => {
    renderWithRouter(<Registro />);

    const regionSelect = screen.getByLabelText('Región:');
    const comunaSelect = screen.getByLabelText('Comuna:');

    // Seleccionar región y comuna
    fireEvent.change(regionSelect, { target: { value: 'metropolitana' } });
    fireEvent.change(comunaSelect, { target: { value: 'santiago' } });
    expect(comunaSelect.value).toBe('santiago');

    // Cambiar región debería resetear comuna
    fireEvent.change(regionSelect, { target: { value: 'valparaiso' } });
    expect(comunaSelect.value).toBe('');
  });

  it('limpia errores cuando el usuario empieza a escribir', async () => {
    renderWithRouter(<Registro />);

    // Generar error
    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });

    // Escribir en el campo debería limpiar el error
    const nombreInput = screen.getByLabelText('Nombre Completo:');
    fireEvent.change(nombreInput, { target: { value: 'Juan' } });

    await waitFor(() => {
      expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument();
    });
  });

  it('maneja registro exitoso', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Usuario creado correctamente'
    });

    global.alert = vi.fn();

    renderWithRouter(<Registro />);

    // Llenar todos los campos
    fireEvent.change(screen.getByLabelText('Nombre Completo:'), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Teléfono:'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText('Región:'), { target: { value: 'metropolitana' } });
    fireEvent.change(screen.getByLabelText('Comuna:'), { target: { value: 'santiago' } });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('¡Registro exitoso! Usuario creado correctamente en la base de datos.');
    });

    // Verificar que el formulario se resetea
    expect(screen.getByLabelText('Nombre Completo:').value).toBe('');
    expect(screen.getByLabelText('Correo:').value).toBe('');
  });

  it('maneja errores del servidor', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Este email ya está registrado'
    });

    renderWithRouter(<Registro />);

    // Llenar todos los campos
    fireEvent.change(screen.getByLabelText('Nombre Completo:'), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Teléfono:'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText('Región:'), { target: { value: 'metropolitana' } });
    fireEvent.change(screen.getByLabelText('Comuna:'), { target: { value: 'santiago' } });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este email ya está registrado')).toBeInTheDocument();
    });
  });

  it('muestra estado de carga durante el registro', async () => {
    // Mock que tarda en resolverse
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          text: async () => 'Usuario creado'
        }), 100)
      )
    );

    renderWithRouter(<Registro />);

    // Llenar todos los campos
    fireEvent.change(screen.getByLabelText('Nombre Completo:'), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Teléfono:'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText('Región:'), { target: { value: 'metropolitana' } });
    fireEvent.change(screen.getByLabelText('Comuna:'), { target: { value: 'santiago' } });

    const submitButton = screen.getByRole('button', { name: 'Registrar' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Registrando...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('tiene la estructura semántica correcta', () => {
    renderWithRouter(<Registro />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    
    // Verificar que hay un formulario
    const form = screen.getByRole('main').querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('es accesible con lectores de pantalla', () => {
    renderWithRouter(<Registro />);

    // Verificar labels asociados
    expect(screen.getByLabelText('Nombre Completo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Teléfono:')).toBeInTheDocument();
    expect(screen.getByLabelText('Región:')).toBeInTheDocument();
    expect(screen.getByLabelText('Comuna:')).toBeInTheDocument();
  });

  it('respeta los límites de caracteres', () => {
    renderWithRouter(<Registro />);

    const nombreInput = screen.getByLabelText('Nombre Completo:');
    const telefonoInput = screen.getByLabelText('Teléfono:');

    expect(nombreInput.getAttribute('maxLength')).toBe('100');
    expect(telefonoInput.getAttribute('maxLength')).toBe('15');
  });

  it('usa los tipos de input correctos', () => {
    renderWithRouter(<Registro />);

    expect(screen.getByLabelText('Correo:').type).toBe('email');
    expect(screen.getByLabelText('Contraseña:').type).toBe('password');
    expect(screen.getByLabelText('Confirmar Contraseña:').type).toBe('password');
    expect(screen.getByLabelText('Teléfono:').type).toBe('tel');
  });

  it('renderiza sin errores', () => {
    expect(() => {
      renderWithRouter(<Registro />);
    }).not.toThrow();
  });
});