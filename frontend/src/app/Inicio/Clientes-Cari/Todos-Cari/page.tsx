"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Cliente = {
  contrato_id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  deuda: number;
};

export default function ClientesCarinan() {
  const [clientes, setClientes] = useState<Cliente[]>([]); // Para los clientes
  const [loading, setLoading] = useState<boolean>(false); // Carga clientes
  const [mensaje, setMensaje] = useState<string | null>(null); // Mensaje de error o éxito

  useEffect(() => {
    fetchClientes();
  }, []); // Ejecutamos fetchClientes solo al cargar el componente

  // Función para obtener los clientes
  const fetchClientes = async () => {
    setLoading(true);
    setMensaje(null); // Limpiar mensaje antes de buscar
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}clientes/clientes/carinan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los clientes");
      }

      const data = await response.json();
      setClientes(data.clientes); // Asignar los clientes encontrados
    } catch (error) {
      setMensaje("No se pudieron cargar los clientes.");
      console.error(error);
    } finally {
      setLoading(false); // Dejar de mostrar el indicador de carga
    }
  };

  // Función para mostrar el mensaje
  const renderMensaje = () => {
    if (mensaje) {
      return (
        <div className="text-center text-blue-500 mt-4">{mensaje}</div>
      );
    }
    return null;
  };

  // Función para mostrar los clientes en una tabla
  const renderClientes = () => {
    if (loading) {
      return <p className="text-center text-blue-800">Cargando...</p>;
    }

    if (clientes.length === 0) {
      return <p className="text-center text-black">No se encontraron clientes.</p>;
    }

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Dirección</th>
              <th className="py-2 px-4 border">Teléfono</th>
              <th className="py-2 px-4 border">Deuda</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr key={cliente.contrato_id || `cliente-${index}`} className="border-b">
                <td className="py-2 px-4">{cliente.nombre}</td>
                <td className="py-2 px-4">{cliente.direccion}</td>
                <td className="py-2 px-4">{cliente.telefono}</td>
                <td className="py-2 px-4">${cliente.deuda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="flex-grow p-6  bg-white text-blue-300">
      <p className="text-center text-xl font-semibold mb-6 text-blue-900">Clientes Carinan</p>

      {renderMensaje()}

      <div className="mt-6">
        {renderClientes()}
      </div>

      {/* Botón */}
      <div className="text-center mt-4">
        <Link href={`/Inicio/Clientes-Cari/`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Regresar
          </button>
        </Link>
      </div>
    </main>
  );
}
