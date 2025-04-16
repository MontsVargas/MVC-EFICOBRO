"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Cliente = {
  id: number;
  nombre: string;
  direccion: string;
  contrato_id?: number;
  contratoStatus?: string;
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

  const verificarContrato = async (idCliente: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}contratos/${idCliente}/contrato`
      );
      const data = await response.json();

      if (data.tieneContrato) {
        return "Con Contrato";
      } else {
        return "Sin Contrato";
      }
    } catch (error) {
      console.error(error);
      return "Error al verificar contrato";
    }
  };

  useEffect(() => {
    async function obtenerContratos() {
      const updatedClientes = await Promise.all(
        clientes.map(async (cliente) => {
          const contratoStatus = await verificarContrato(cliente.id);
          return { ...cliente, contratoStatus };
        })
      );
      setClientes(updatedClientes);
    }

    if (clientes.length > 0) {
      obtenerContratos();
    }
  }, [clientes]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <motion.h1
        className="text-4xl font-extrabold tracking-wide text-blue-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
       Todos los Clientes
      </motion.h1>

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

      {/* Tabla con scroll horizontal y vertical */}
      <div className="w-full max-w-5xl overflow-auto max-h-[70vh] border border-blue-300 rounded-lg shadow-lg">
        <table className="w-full min-w-[600px] bg-white">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Dirección</th>
              <th className="p-4 text-left">Contrato</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <motion.tr
                key={index}
                className="border-b border-blue-200 hover:bg-blue-100 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="p-4 text-blue-900">{cliente.nombre}</td>
                <td className="p-4 text-blue-900">{cliente.direccion}</td>
                <td className="p-4 text-blue-900">
                  {cliente.contratoStatus || "Verificando..."}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
