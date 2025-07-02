"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterInput, registerUser } from '@/apis/login/route';

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      alert('Usuario registrado exitosamente!');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F1E3] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <img src="/logo.png" alt="Animalitos" className="mx-auto w-24 mb-4" />
        <h2 className="text-2xl font-bold text-[#4B3621] mb-2">Regístrate en Patitas Felices</h2>
        <p className="text-[#8C6A4D] mb-6">Crea una cuenta para comenzar</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Username</label>
            <input
              type="text"
              name='nombre'
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Correo electrónico</label>
            <input
              type="email"
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
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#8C6A4D] hover:bg-[#4B3621] text-white py-2 rounded-lg transition"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-sm text-[#8C6A4D]">
          ¿Ya tienes cuenta?{' '}
          <button onClick={goToLogin} className="text-[#4B3621] hover:underline cursor-pointer">
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
