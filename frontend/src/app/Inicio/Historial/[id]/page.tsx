"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation';

type Historial = {
  id: number;
  fecha: string;
  servicioNombre: string;
  tipoServicio: string;
  plantaNombre: string;
};

export default function HistorialCliente() {
  const { id } = useParams();
  console.log("ID recibido en el frontend:", id);

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
        console.log("Historial recibido en el frontend:", data.historialCompras); // 🔍 Debugging

        // Verifica si "historialCompras" existe y tiene datos
        if (data.historialCompras && data.historialCompras.length > 0) {
          const compras = data.historialCompras.map((compra: any) => ({
            id: compra.id,
            fecha: compra.fecha,
            clienteNombre: compra.cliente?.nombre ?? "Desconocido",
            servicioNombre: compra.servicio?.nombre ?? "No disponible",
            tipoServicio: compra.servicio?.Tiposervicio?.nombre ?? "No disponible",
            plantaNombre: compra.planta?.nombre ?? "No disponible",
          }));

          setHistorial(compras);
        } else {
          setError("No hay historial disponible para este cliente.");
        }
      } catch (error) {
        setError("No se pudo cargar el historial. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, [id]);

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
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
        <p className="text-red-500">{error}</p>
      ) : historial.length > 0 ? (
        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Servicio</th>
                <th className="p-3 text-left">Tipo de Servicio</th>
                <th className="p-3 text-left">Planta</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3 text-gray-700">
                    {new Date(item.fecha).toLocaleDateString() || "Fecha no válida"}
                  </td>
                  <td className="p-3 text-gray-600 font-semibold">{item.servicioNombre}</td>
                  <td className="p-3 text-gray-700">{item.tipoServicio}</td>
                  <td className="p-3 text-gray-700">{item.plantaNombre}</td>
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
