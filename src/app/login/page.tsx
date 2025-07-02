'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginInput, loginUser } from '@/apis/login/route';
import { useAuth } from '@/context/authContext';

const LoginPage = () => {
  const router = useRouter();
  const { setToken } = useAuth(); // ✅ Importante: usamos el contexto
  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await loginUser(form);
      setToken(token); // ✅ usamos el contexto para guardar y propagar el token
      router.push('/home');
    } catch {
      setError('Credenciales inválidas');
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F1E3]">
      <div className="w-1/2 bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <img src="/logo.png" alt="Animalitos" className="mx-auto w-24 mb-4" />
        <h2 className="text-2xl font-bold text-[#4B3621] mb-2">Bienvenido a Patitas Felices</h2>
        <p className="text-[#8C6A4D] mb-6">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Correo electrónico</label>
            <input
              type="text"
              name='email'
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Contraseña</label>
            <input
              type="password"
              name='password'
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#8C6A4D] hover:bg-[#4B3621] text-white py-2 rounded-lg transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-sm text-[#8C6A4D]">
          ¿No tienes cuenta?{' '}
          <button onClick={goToRegister} className="text-[#4B3621] hover:underline cursor-pointer">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
