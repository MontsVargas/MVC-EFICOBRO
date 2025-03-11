"use client";
import { useState, useEffect } from "react";

type Cliente = {
  contrato_id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  deuda: number;
};

export default function ClientesCariñan() {
  const [nombre, setNombre] = useState<string>(""); // Estado para el nombre del cliente
  const [clientes, setClientes] = useState<Cliente[]>([]); // Estado para los clientes
  const [mensaje, setMensaje] = useState<string | null>(null); // Mensaje de error o éxito
  const [loading, setLoading] = useState<boolean>(false); // Estado para cargar clientes

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setMensaje(null); // Limpiar mensaje antes de buscar
      try {
        // Asegurarse de que la URL del backend esté correctamente construida
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/clientes?nombre=${nombre}`, // Corregir la ruta aquí
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
        setClientes(data.clientes); // Asignar los clientes encontrados
      } catch (error) {
        setMensaje("No se pudieron cargar los clientes.");
        console.error(error);
      } finally {
        setLoading(false); // Dejar de mostrar el indicador de carga
      }
    };

    if (nombre) {
      fetchClientes(); // Solo buscar si el nombre no está vacío
    } else {
      setClientes([]); // Si no hay nombre, limpiar la lista de clientes
    }
  }, [nombre]); // Cuando 'nombre' cambie, vuelve a buscar clientes

  return (
    <main className="flex-grow p-6 bg-white">
      <p className="text-center text-xl font-semibold mb-6 text-blue-900">Clientes Cariñan</p>

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
        <div className="text-center text-red-500 mt-4">{mensaje}</div>
      )}

      {/* Mostrar clientes */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-blue-500">Cargando...</p>
        ) : (
          <div>
            {clientes.length === 0 ? (
              <p className="text-center text-gray-500">No se encontraron clientes.</p>
            ) : (
              <div className="space-y-4">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.contrato_id}
                    className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
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
