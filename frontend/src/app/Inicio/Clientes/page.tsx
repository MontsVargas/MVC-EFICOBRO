"use client"

import Link from 'next/link';
import { useState } from 'react';
import Formulario from './_components/Formulario';
export default function Clientes() {

  const [mostrarInput, setMostrarInput] = useState(false);

  return (
    <main className="flex-grow p-6 bg-white">
      <p className="text-center text-xl font-semibold text-black">Buscar cliente</p>
      {/* Buttons */}
      <div className="flex flex-col items-center space-y-4">
        <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]" onClick={() => setMostrarInput(prev => !prev)}>INGRESA EL NOMBRE DEL CLIENTE</button>
        <Link href="/Inicio/Clientes/Todos">
          <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">MOSTRAR TODOS LOS CLIENTES</button>
        </Link>
        <Link href="/Inicio/Clientes-Nuevos">
          <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">AGREGAR CLIENTE</button>
        </Link>
      </div>
      {
        mostrarInput && (
          <Formulario />
        )
      }
    </main>
  );
}