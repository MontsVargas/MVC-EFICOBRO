"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "just-debounce-it";

export default function Cuentas() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Error al generar el reporte");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("No se pudo generar el reporte");
    }
  };

  const debouncedSetNombre = useCallback(debounce(setNombre, 500), []);

  return (
    <main className="flex-grow p-6 bg-white text-blue-900">
      <motion.p 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-center text-2xl font-bold mb-6"
      >
        Generación de Reportes
      </motion.p>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <motion.input
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          type="text"
          placeholder="Nombre del cliente"
          onChange={(e) => debouncedSetNombre(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-black mt-2 text-sm">{error}</p>}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL}pdf/cliente/nombre?nombre=${encodeURIComponent(nombre)}`, `estado_cuenta_cliente_${nombre}.pdf`)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte Cliente
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/generales`, "reporte_general.pdf")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte General
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/semanales`, "reporte_semanal.pdf")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte Semanal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/mensuales`, "reporte_mensual.pdf")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte Mensual
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/anuales?year=${new Date().getFullYear()}`, `reporte_anual_${new Date().getFullYear()}.pdf`)}
            className="col-span-full bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800"
          >
            Reporte Anual
          </motion.button>
        </div>
      </div>
    </main>
  );
}
