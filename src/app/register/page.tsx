"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí iría la lógica para registrar el usuario (API, Firebase, etc)
    console.log('Correo:', email);
    console.log('Contraseña:', password);

    // Simulación de registro exitoso
    alert('Usuario registrado exitosamente');
    router.push('/login'); // Redirige a login
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

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Correo electrónico</label>
            <input
              type="email"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Contraseña</label>
            <input
              type="password"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B3621]">Confirmar contraseña</label>
            <input
              type="password"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C6A4D]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Repite tu contraseña"
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
