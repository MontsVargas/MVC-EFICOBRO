"use client";

import { ChangeEvent, FormEvent, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import debounce from "just-debounce-it";
import Link from "next/link";

type Cliente = {
  id: number;
  nombre: string;
  direccion: string;
  contrato_id?: number;
  contratoStatus?: string; // Campo para almacenar el estado del contrato
};

type BuscarClientesResponse = {
  clientes: Cliente[];
};

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Función para verificar el contrato del cliente
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
      console.error("Error al verificar el contrato:", error);
      return "Error al verificar contrato";
    }
  };

  // Función para buscar clientes con debounce
  async function buscarCliente(cliente: string) {
    try {
      if (cliente === "") {
        setClientes([]);
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}cliente/buscar?nombre=${cliente}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error desconocido");
        return;
      }

      const data: BuscarClientesResponse = await response.json();
      setClientes(data.clientes || []);
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      setError("Error al buscar clientes");
    }
  }

  // Función para manejar el cambio en el input
  const debounceCliente = useCallback(
    debounce(async (nombre: string) => {
      await buscarCliente(nombre);
    }, 500),
    []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    buscarCliente(nombre);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = e.target.value;
    setNombre(nuevoNombre);
    debounceCliente(nuevoNombre);
  };

  // Actualizar los contratos de los clientes una vez que la lista haya sido obtenida
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
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <motion.input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
          placeholder="Ingrese el nombre del cliente..."
          onChange={handleChange}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Buscar
        </motion.button>
      </form>

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

      {/* Tabla de clientes con animación */}
      {clientes.length > 0 ? (
        <motion.div
          className="overflow-hidden rounded-lg shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Dirección</th>
                <th className="p-3 text-left">Contrato</th>
                <th className="p-3 text-left">Información</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <motion.tr
                  key={cliente.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="p-3 text-blue-900 font-medium">
                    {cliente.nombre}
                  </td>
                  <td className="p-3 text-gray-700">{cliente.direccion}</td>
                  <td className="p-3 font-semibold text-blue-600">
                    {cliente.contratoStatus || "Verificando..."}
                  </td>
                  <td className="p-3 text-blue-600 underline">
                    <Link href={`/Inicio/Historial/${cliente.id}`}>
                      Ver Historial
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.p
          className="text-gray-500 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No se encontraron clientes.
        </motion.p>
      )}
    </motion.div>
  );
}
