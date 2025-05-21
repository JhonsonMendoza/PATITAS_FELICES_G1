"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DropdownUser from "./dropdown";

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-[#8C6A4D] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Marca */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <img
              src="/logo.png"
              alt="Patitas Felices Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <span className="text-2xl font-extrabold tracking-wide">
            Patitas Felices
          </span>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          {[
            { name: "Mis Mascotas", path: "/mascotas" },
            { name: "Medicinas", path: "/medicinas" },
            { name: "Horarios de Juego", path: "/horarios" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="hover:text-[#F9F1E3] transition duration-200"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Botón perfil */}
        <div className="hidden md:block">
          <button
            className="flex gap-3 items-center bg-white text-[#8C6A4D] px-5 py-2 rounded-full font-semibold shadow-sm hover:bg-[#f2e3d2] transition"
          >
            Mi Perfil <DropdownUser />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
