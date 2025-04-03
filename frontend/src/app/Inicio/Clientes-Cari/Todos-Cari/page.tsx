"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Cliente = {
  contrato_id: string;
  nombre: string;
  direccion: string;
  telefono: string;
};

export default function ClientesCarinan() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    setMensaje(null);
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
      setClientes(data.clientes);
    } catch (error) {
      setMensaje("No se pudieron cargar los clientes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow p-6 bg-gradient-to-br from-blue-100 to-blue-300 text-gray-900 min-h-screen">
      <p className="text-center text-3xl font-bold mb-6 text-blue-900">Clientes Cariñan</p>

      {mensaje && <div className="text-center text-red-600 font-semibold">{mensaje}</div>}

      <div className="overflow-x-auto mt-6 shadow-lg rounded-lg border border-blue-300 bg-white">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-800 text-white text-lg">
            <tr>
              <th className="py-3 px-4 border">Nombre</th>
              <th className="py-3 px-4 border">Dirección</th>
              <th className="py-3 px-4 border">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-blue-800 font-semibold">Cargando...</td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-700">No se encontraron clientes.</td>
              </tr>
            ) : (
              clientes.map((cliente, index) => (
                <tr
                  key={cliente.contrato_id || `cliente-${index}`}
                  className="border-b hover:bg-blue-100 transition-all"
                >
                  <td className="py-3 px-4 font-semibold text-blue-700">{cliente.nombre}</td>
                  <td className="py-3 px-4 text-gray-600">{cliente.direccion}</td>
                  <td className="py-3 px-4 text-gray-600">{cliente.telefono}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <Link href={`/Inicio/Clientes-Cari/`}>
          <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all shadow-md">
            Regresar
          </button>
        </Link>
      </div>
    </main>
  );
}