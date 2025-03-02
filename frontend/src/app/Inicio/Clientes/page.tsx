"use client";

import Link from "next/link";
import { useState } from "react";
import Formulario from "./_components/Formulario";

export default function Clientes() {
  const [mostrarInput, setMostrarInput] = useState(false);

  return (
    <main className="flex-grow p-6 bg-white flex flex-col items-center">
      <p className="text-center text-3xl font-bold text-blue-800 mb-6">Buscar Cliente</p>

      {/* Botón principal */}
      <button
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-8 rounded-xl shadow-md 
                   hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
        onClick={() => setMostrarInput((prev) => !prev)}
      >
        INGRESA EL NOMBRE DEL CLIENTE
      </button>

      {/* Formulario de búsqueda */}
      {mostrarInput && <Formulario />}

      {/* Botones condicionales */}
      {!mostrarInput ? (
        <div className="flex flex-col items-center space-y-4 mt-6">
          <Link href="/Inicio/Clientes/Todos">
            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl shadow-md 
                              hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
              MOSTRAR TODOS LOS CLIENTES
            </button>
          </Link>

          <Link href="/Inicio/Clientes-Nuevos">
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-8 rounded-xl shadow-md 
                              hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
              AGREGAR CLIENTE
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex justify-between w-full max-w-md mt-6 space-x-4">
          <Link href="/Inicio/Clientes/Todos">
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl shadow-md 
                              hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
              MOSTRAR TODOS
            </button>
          </Link>

          <Link href="/Inicio/Clientes-Nuevos">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-8 rounded-xl shadow-md 
                              hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
              AGREGAR
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
