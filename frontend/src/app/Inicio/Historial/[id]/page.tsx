"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

type Historial = {
  id: number;
  fechaCompra: string;
  fechaCaptura: string;
  servicioNombre: string;
  tipoServicioNombre: string;
  plantaNombre: string;
  cantidadServicio: number;
};

export default function HistorialCliente() {
  const { id } = useParams();
  const router = useRouter();

  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("El ID del cliente no está disponible");
      setLoading(false);
      return;
    }

    async function fetchHistorial() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}historial/historial/${id}`, // Corrección en la URL
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el historial");
        }

        const data = await response.json();

        const compras = data.historialCompras.map((compra: any) => ({
          id: compra.id,
          fechaCompra: compra.fecha,
          fechaCaptura: compra.createdAt,
          servicioNombre: compra.servicio?.nombre ?? "No disponible",
          tipoServicioNombre: compra.servicio?.tipoServicio ?? "No disponible",
          plantaNombre: compra.planta?.nombre ?? "No disponible",
          cantidadServicio: compra.cantidadServicio,
        }));

        setHistorial(compras);
      } catch (error) {
        setError("No se pudo cargar el historial");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, [id]);

  const handleActualizar = (compraId: number) => {
    router.push(`/Inicio/Actualizar/${compraId}`); // Corrección en la interpolación de la URL
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial del Cliente</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : error ? (
        <p className="text-blue-500 text-sm">{error}</p>
      ) : historial.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <div className="overflow-x-auto">
            {/* Cabecera de la tabla */}
            <table className="w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left text-sm w-1/6">Fecha <br /> de compra</th>
                  <th className="p-3 text-left text-sm w-1/6">Fecha <br /> de captura</th>
                  <th className="p-3 text-left text-sm w-1/6">Servicio</th>
                  <th className="p-3 text-left text-sm w-1/6">Tipo de <br /> Servicio</th>
                  <th className="p-3 text-left text-sm w-1/6">Planta</th>
                  <th className="p-3 text-left text-sm w-1/6">Cantidad</th>
                  <th className="p-3 text-left text-sm w-1/6">Actualizar</th>
                </tr>
              </thead>
            </table>

            {/* Contenedor de la tabla con scroll vertical */}
            <div className="overflow-y-auto max-h-96">
              <table className="w-full bg-white border border-gray-200 rounded-lg">
                <tbody>
                  {historial.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="p-3 text-center text-gray-700 text-sm w-1/6">
                        {new Date(item.fechaCompra).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center text-gray-700 text-sm w-1/6">
                        {new Date(item.fechaCaptura).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center text-gray-600 font-semibold text-sm w-1/6">
                        {item.servicioNombre}
                      </td>
                      <td className="p-3 text-center text-gray-700 text-sm w-1/6">
                        {item.tipoServicioNombre}
                      </td>
                      <td className="p-3 text-center text-gray-700 text-sm w-1/6">{item.plantaNombre}</td>
                      <td className="p-3 text-center text-gray-700 text-sm w-1/6">{item.cantidadServicio}</td>
                      <td className="p-3 text-center w-1/6">
                        <button
                          onClick={() => handleActualizar(item.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                        >
                          Actualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No hay historial disponible.</p>
      )}
    </motion.div>
  );
}
