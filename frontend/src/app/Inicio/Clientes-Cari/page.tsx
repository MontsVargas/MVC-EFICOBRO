"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import debounce from "just-debounce-it";

type Cliente = {
  contrato_id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  deuda: number;
};

export default function ClientesCarinan() {
  const [nombre, setNombre] = useState<string>("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buscarCliente = async (nombreCliente: string) => {
    if (!nombreCliente) {
      setMensaje("Por favor ingresa un nombre de cliente.");
      return;
    }

    setLoading(true);
    setMensaje(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}clientes/clientes/carinan?nombre=${encodeURIComponent(nombreCliente)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  const debounceCliente = useCallback(
    debounce(async (nombre: string) => {
      await buscarCliente(nombre);
    }, 500),
    []
  );

  useEffect(() => {
    if (nombre) {
      debounceCliente(nombre);
    }
  }, [nombre, debounceCliente]);

  return (
    <main className="flex-grow p-6 bg-gradient-to-r from-blue-50 to-blue-100">
      <p className="text-center text-3xl font-semibold mb-8 text-blue-700">Clientes Carinan</p>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <label className="block text-lg font-medium mb-2 text-gray-700">Buscar por nombre</label>
        <input
          type="text"
          className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {mensaje && <div className="text-center text-blue-600 mt-4">{mensaje}</div>}

      {loading ? (
        <p className="text-center text-blue-700 mt-4">Cargando...</p>
      ) : (
        <div className="mt-8 space-y-4">
          {clientes.length === 0 ? (
            <p className="text-center text-gray-700">No se encontraron clientes.</p>
          ) : (
            clientes.map((cliente, index) => (
              <div
                key={cliente.contrato_id || index}
                className="p-4 bg-white border border-blue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="font-semibold text-xl text-blue-700">{cliente.nombre}</p>
                <p className="text-gray-600">{cliente.direccion}</p>
                <p className="text-gray-600">{cliente.telefono}</p>
                <p className="font-semibold text-blue-600">Deuda: ${cliente.deuda}</p>
              </div>
            ))
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href={`/Inicio/Clientes-Cari/Todos-Cari`}>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ease-in-out duration-300 shadow-md">
            Ver Todos los Clientes
          </button>
        </Link>
      </div>
    </main>
  );
}
