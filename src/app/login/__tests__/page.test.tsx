import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock de next/navigation
const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Mock de contexto de autenticación
const setToken = jest.fn();
jest.mock('@/context/authContext', () => ({
  useAuth: () => ({ setToken }),
}));

// Mock de la API loginUser
const mockLoginUser = jest.fn();
jest.mock('@/apis/login/route', () => ({
  loginUser: (...args: any[]) => mockLoginUser(...args),
}));

// Importar el componente a probar
import LoginPage from '../page';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los campos y el botón', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Regístrate aquí/i })).toBeInTheDocument();
  });

  it('loguea correctamente y navega a /home', async () => {
    mockLoginUser.mockResolvedValueOnce({ token: 'token-123' });

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), 'supersecret');

    await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(() => expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'supersecret',
    }));

    expect(setToken).toHaveBeenCalledWith('token-123');
    expect(push).toHaveBeenCalledWith('/home');
  });

  it('muestra error si las credenciales son inválidas', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/Correo electrónico/i), 'x@y.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), 'wrong');

    await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    expect(await screen.findByText(/Credenciales inválidas/i)).toBeInTheDocument();
    expect(setToken).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalledWith('/home');
  });

  it('navega a /register al hacer clic en "Regístrate aquí"', async () => {
    render(<LoginPage />);

    await userEvent.click(screen.getByRole('button', { name: /Regístrate aquí/i }));

    expect(push).toHaveBeenCalledWith('/register');
  });
});
