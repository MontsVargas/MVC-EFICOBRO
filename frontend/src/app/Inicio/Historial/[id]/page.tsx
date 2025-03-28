"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation'

type Historial = {
  id: number;
  fecha: string;
  descripcion: string;
};

export default function HistorialCliente() {
  const { id } = useParams();
  console.log(id);
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {

    async function fetchHistorial() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}historial/historial${encodeURIComponent(id as string)}`,
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
        setHistorial(data.historial || []);
      } catch (error) {
        setError("No se pudo cargar el historial");
      } finally {
        setLoading(false);
      }
    }

    fetchHistorial();
  }, [id]);

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Historial de {id}
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
                <th className="p-3 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3 text-gray-700">{new Date(item.fecha).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{item.descripcion}</td>
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
