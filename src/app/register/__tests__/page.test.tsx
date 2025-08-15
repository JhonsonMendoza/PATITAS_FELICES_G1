import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock del router de Next
const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Mock de la API de registro
const mockRegisterUser = jest.fn();
jest.mock('@/apis/login/route', () => ({
  registerUser: (...args: any[]) => mockRegisterUser(...args),
}));

// Importar el componente después de definir los mocks
import RegisterPage from '../page';

describe('RegisterPage', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza campos y botón', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inicia sesión aquí/i })).toBeInTheDocument();
  });

  it('registra exitosamente y navega a /login', async () => {
    mockRegisterUser.mockResolvedValueOnce({ ok: true });

    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/Username/i), 'Genesis');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'genesis@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), 'secret123');

    await userEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    await waitFor(() =>
      expect(mockRegisterUser).toHaveBeenCalledWith({
        nombre: 'Genesis',
        email: 'genesis@test.com',
        password: 'secret123',
      })
    );

    expect(alertSpy).toHaveBeenCalledWith('Usuario registrado exitosamente!');
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('muestra mensaje de error si falla el registro', async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error('Correo ya registrado'));

    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/Username/i), 'G');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'g@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), '123456');

    await userEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    // Debe aparecer el error en pantalla
    expect(await screen.findByRole('alert')).toHaveTextContent(/Correo ya registrado/i);
    // No debería navegar
    expect(push).not.toHaveBeenCalledWith('/login');
  });

  it('navega a /login al hacer clic en "Inicia sesión aquí"', async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByRole('button', { name: /Inicia sesión aquí/i }));
    expect(push).toHaveBeenCalledWith('/login');
  });

  // Opcional si agregas guardia de loading en handleSubmit
  it('evita doble submit si está cargando', async () => {
    // Simulamos una promesa pendiente para el primer submit
    let resolveFn: (v?: any) => void;
    const pending = new Promise((res) => (resolveFn = res));
    mockRegisterUser.mockReturnValueOnce(pending as any);

    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/Username/i), 'G');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'g@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), '123456');

    const submitBtn = screen.getByRole('button', { name: /Registrarse/i });
    // Dos clics casi simultáneos
    await Promise.all([userEvent.click(submitBtn), userEvent.click(submitBtn)]);

    // Si en tu componente añadiste `if (loading) return;`, debería llamarse solo 1 vez
    expect(mockRegisterUser).toHaveBeenCalledTimes(1);

    // Resolvemos para no dejar promesa colgada
    resolveFn!({ ok: true });
  });
});
