"use client";
import { useState, useEffect } from "react";

type Cliente = {
  contrato_id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  deuda: number;
};

export default function ClientesCarinan() {
  const [nombre, setNombre] = useState<string>(""); // El nombre del cliente
  const [clientes, setClientes] = useState<Cliente[]>([]); // Para los clientes
  const [mensaje, setMensaje] = useState<string | null>(null); // Mensaje de error o éxito
  const [loading, setLoading] = useState<boolean>(false); // Carga clientes

  useEffect(() => {
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

    fetchClientes(); // Obtener los clientes de Carinan siempre que el componente se cargue
  }, []); // El array vacío significa que solo se ejecuta cuando el componente se muestra

  return (
    <main className="flex-grow p-6 bg-white">
      <p className="text-center text-xl font-semibold mb-6 text-blue-900">Clientes Carinan</p>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
        <label className="block text-lg font-medium mb-2 text-black">Buscar por nombre</label>
        <input
          type="text"
          className="w-full p-3 border text-black rounded-md"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} // Actualiza el estado del nombre
        />
      </div>

      {/* Mensajes de error o éxito */}
      {mensaje && (
        <div className="text-center text-blue-500 mt-4">{mensaje}</div>
      )}

      {/* Mostrar clientes */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-blue-800">Cargando...</p>
        ) : (
          <div>
            {clientes.length === 0 ? (
              <p className="text-center text-black">No se encontraron clientes.</p>
            ) : (
              <div className="space-y-4">
                {clientes.map((cliente, index) => (
                  <div
                    key={index}
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
      </div>
    </main>
  );
}
