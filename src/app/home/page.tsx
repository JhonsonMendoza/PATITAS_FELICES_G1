"use client";

import React from "react";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-[#F9F1E3] min-h-screen text-[#4B3621]">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-8">
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Patitas Felices 🐾</h1>
          <p className="text-lg">
            Tu espacio para llevar el control completo de tus mascotas. Gestiona sus datos,
            vacunas, horarios y más con una interfaz amigable y divertida.
          </p>
        </motion.div>

        <motion.img
          src="/perritosJugando.jpg"
          alt="Mascotas Felices"
          className="md:w-1/2 rounded-3xl shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
      </section>

      {/* Funcionalidades */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <motion.div
            className="bg-[#F9F1E3] p-6 rounded-xl shadow hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/mascotas.png" alt="Mascotas" className="mx-auto w-20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mis Mascotas</h3>
            <p>Agrega, edita y revisa los datos importantes de tus mascotas.</p>
          </motion.div>

          <motion.div
            className="bg-[#F9F1E3] p-6 rounded-xl shadow hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/medicina.png" alt="Medicinas" className="mx-auto w-20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Control de Medicinas</h3>
            <p>Lleva el control de vacunas, tratamientos y fechas médicas importantes.</p>
          </motion.div>

          <motion.div
            className="bg-[#F9F1E3] p-6 rounded-xl shadow hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/horarios.png" alt="Horarios" className="mx-auto w-20 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rutinas y Horarios</h3>
            <p>Organiza las horas de juego, comida, paseos y visitas al veterinario.</p>
          </motion.div>
        </div>
      </section>

      {/* Mensaje final */}
      <section className="text-center py-16 bg-[#8C6A4D] text-white">
        <h2 className="text-3xl font-bold mb-4">¡Gracias por confiar en nosotros!</h2>
        <p className="text-lg">
          Explora todas las funciones disponibles en tu panel y haz felices a tus patitas. 🐶🐱
        </p>
      </section>
    </div>
  );
};

export default HomePage;
