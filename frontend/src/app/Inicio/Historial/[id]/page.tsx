"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

type Historial = {
  id: number;
  fechaCompra: string;     // Desde la base de datos
  fechaCaptura: string;    // Generada en frontend
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
          `${process.env.NEXT_PUBLIC_API_URL}historial/historial/${id}`,
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
        const fechaActual = new Date().toISOString();

        const compras = data.historialCompras.map((compra: any) => ({
          id: compra.id,
          fechaCompra: compra.fecha, // Fecha real de la compra desde backend
          fechaCaptura: fechaActual, // Fecha actual cuando se carga la info
          servicioNombre: compra.servicio?.nombre ?? "No disponible",
          tipoServicioNombre: compra.servicio?.tipoServicio ?? "No disponible",
          plantaNombre: compra.planta?.nombre ?? "No disponible",
          cantidadServicio: compra.cantidadServicio,
        }));

        setHistorial(compras);
      } catch (error) {
        setError("No se pudo cargar el historial");
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, [id]);

  const handleActualizar = (compraId: number) => {
    router.push(`/Inicio/Actualizar/${compraId}`);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Historial del Cliente
      </h2>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-blue-500">{error}</p>
      ) : historial.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Fecha de compra</th>
                <th className="p-3 text-left">Fecha de captura</th>
                <th className="p-3 text-left">Servicio</th>
                <th className="p-3 text-left">Tipo de Servicio</th>
                <th className="p-3 text-left">Planta</th>
                <th className="p-3 text-left">Cantidad</th>
                <th className="p-3 text-left">Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="p-3 text-gray-700">
                    {new Date(item.fechaCompra).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-700">
                    {new Date(item.fechaCaptura).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-600 font-semibold">
                    {item.servicioNombre}
                  </td>
                  <td className="p-3 text-gray-700">{item.tipoServicioNombre}</td>
                  <td className="p-3 text-gray-700">{item.plantaNombre}</td>
                  <td className="p-3 text-gray-700">{item.cantidadServicio}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleActualizar(item.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No hay historial disponible.</p>
      )}
    </motion.div>
  );
}
