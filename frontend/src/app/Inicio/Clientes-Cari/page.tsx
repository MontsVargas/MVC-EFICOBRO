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

  // Función para obtener los clientes por nombre
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

  // Debounce aplicado a la función buscarCliente
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
    <main className="flex-grow p-6 bg-white">
      <p className="text-center text-xl font-semibold mb-6 text-blue-900">Clientes Carinan</p>

      <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
        <label className="block text-lg font-medium mb-2 text-black">Buscar por nombre</label>
        <input
          type="text"
          className="w-full p-3 border text-black rounded-md"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      {mensaje && <div className="text-center text-blue-500 mt-4">{mensaje}</div>}

      {loading ? (
        <p className="text-center text-blue-800">Cargando...</p>
      ) : (
        <div className="mt-6">
          {clientes.length === 0 ? (
            <p className="text-center text-black">No se encontraron clientes.</p>
          ) : (
            <div className="space-y-4">
              {clientes.map((cliente, index) => (
                <div
                  key={cliente.contrato_id || index}
                  className="p-4 bg-blue-300 border border-blue-500 rounded-md shadow-sm"
                >
                  <p className="font-semibold">{cliente.nombre}</p>
                  <p>{cliente.direccion}</p>
                  <p>{cliente.telefono}</p>
                  <p>Deuda: ${cliente.deuda}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-4">
        <Link href={`/Inicio/Clientes-Cari/Todos-Cari`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Todos los clientes
          </button>
        </Link>
      </div>
    </main>
  );
}
