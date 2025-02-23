"use client";

import { useState, useEffect } from "react";

type Cliente = {
  nombre: string;
  direccion: string;
  contrato_id?: number;
};

export default function Todos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function obtenerClientes() {
      try {
        const response = await fetch("http://localhost:4000/cliente/buscar", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Error desconocido");
          return;
        }

        const data = await response.json();
        setClientes(data.clientes || []); // Aseguramos que el array 'clientes' esté presente
      } catch (err) {
        setError("Error al obtener clientes");
      }
    }
    obtenerClientes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Todos los Clientes</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>} {/* Mostrar error si existe */}

      <div className="w-full max-w-4xl">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border border-blue-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Dirección</th>
              <th className="p-4 text-left">Contrato ID</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr
                key={index}
                className="border-b border-blue-200 hover:bg-blue-100 transition"
              >
                <td className="p-4 text-blue-900">{cliente.nombre}</td>
                <td className="p-4 text-blue-900">{cliente.direccion}</td>
                <td className="p-4 text-blue-900">
                  {cliente.contrato_id ? cliente.contrato_id : "Sin Contrato"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
