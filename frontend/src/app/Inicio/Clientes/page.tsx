"use client"

import Link from 'next/link';
import { useState } from 'react';
import Formulario from './_components/Formulario';

export default function Clientes() {

  const [mostrarInput, setMostrarInput] = useState(false);

  return (
    <main className="flex-grow p-6 bg-white">
      <p className="text-center text-2xl font-semibold text-gray-800 mb-6">Buscar cliente</p>
      
      {/* Botones iniciales */}
      <div className="flex flex-col items-center space-y-4">
        <button 
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none"
          onClick={() => setMostrarInput(prev => !prev)}>
          INGRESA EL NOMBRE DEL CLIENTE
        </button>

        {mostrarInput && (
          <Formulario />
        )}

        {/* Condición para cambiar la visualización de los botones cuando el formulario está visible */}
        {!mostrarInput && (
          <div className="flex flex-col items-center space-y-4">
            <Link href="/Inicio/Clientes/Todos">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none">
                MOSTRAR TODOS LOS CLIENTES
              </button>
            </Link>

            <Link href="/Inicio/Clientes-Nuevos">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none">
                AGREGAR CLIENTE
              </button>
            </Link>
          </div>
        )}

        {/* Mostrar botones a la izquierda y derecha solo después de mostrar el input */}
        {mostrarInput && (
          <div className="flex justify-between w-full mt-6 space-x-2">
            <Link href="/Inicio/Clientes/Todos">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none">
                MOSTRAR TODOS LOS CLIENTES
              </button>
            </Link>

            <Link href="/Inicio/Clientes-Nuevos">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none">
                AGREGAR CLIENTE
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
