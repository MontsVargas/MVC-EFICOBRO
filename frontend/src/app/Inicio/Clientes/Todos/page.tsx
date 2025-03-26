"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cliente/buscar`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Error desconocido");
          return;
        }

        const data = await response.json();
        setClientes(data.clientes || []);
      } catch {
        setError("Error al obtener clientes");
      }
    }
    obtenerClientes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      {/* Título con animación y nueva tipografía */}
      <motion.h1
        className="text-4xl font-extrabold tracking-wide text-blue-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
         Lista de Clientes
      </motion.h1>

      {/* Mensaje de error si ocurre un problema */}
      {error && (
        <motion.div
          className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 w-full max-w-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      {/* Tabla de clientes */}
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
              <motion.tr
                key={index}
                className="border-b border-blue-200 hover:bg-blue-100 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="p-4 text-blue-900">{cliente.nombre}</td>
                <td className="p-4 text-blue-900">{cliente.direccion}</td>
                <td className="p-4 text-blue-900">
                  {cliente.contrato_id ? cliente.contrato_id : "Sin Contrato"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
