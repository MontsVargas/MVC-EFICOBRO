"use client";

import { useState, useCallback } from "react";
import debounce from "just-debounce-it";

export default function Cuentas() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reporte por cliente (por nombre)
  const handleDownloadReport = async () => {
    if (!nombre) {
      setError("Por favor, ingresa un nombre de cliente");
      return;
    }
    setError(null);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pdf/cliente/nombre?nombre=${encodeURIComponent(nombre)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo generar el reporte");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estado_cuenta_cliente_${nombre}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al generar el reporte");
    }
  };
  // Reporte general
  const handleDownloadGeneralReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/generales`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo generar el reporte general");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_general.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al generar el reporte general");
    }
  };

  // Reporte semanal
  const handleDownloadWeeklyReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/semanales`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo generar el reporte semanal");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_semanal.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al generar el reporte semanal");
    }
  };

  // Reporte mensual
  const handleDownloadMonthlyReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/mensuales`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo generar el reporte mensual");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_mensual.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al generar el reporte mensual");
    }
  };

  // Reporte anual (puedes ajustar para permitir selección de año)
  const handleDownloadYearlyReport = async () => {
    // Por defecto se usa el año actual
    const year = new Date().getFullYear();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/anuales?year=${year}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("No se pudo generar el reporte anual");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_anual_${year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al generar el reporte anual");
    }
  };
  const debouncedSetNombre = useCallback(debounce(setNombre, 500), []);

  return (
    <main className="flex-grow p-6 bg-white text-blue-900">
      <p className="text-center text-xl font-semibold mb-6">
        Selecciona la información para generar el reporte
      </p>

      <div className="max-w-3xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">
          Generación de Reportes
        </h2>

        <div className="flex flex-col items-center mt-6">
          {/* Input para buscar por cliente */}
          <input
            type="text"
            placeholder="Nombre del cliente"
            onChange={(e) => debouncedSetNombre(e.target.value)}
            className="p-3 w-full max-w-md border border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          <button
            onClick={handleDownloadReport}
            className="mt-4 bg-[#4ab9d2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3a99b2] transition duration-300 ease-in-out transform hover:scale-105"
          >
            Descargar Reporte Cliente
          </button>

          {/* Sección para los otros reportes */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button
              onClick={handleDownloadGeneralReport}
              className="bg-[#4ab9d2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3a99b2] transition duration-300 ease-in-out transform hover:scale-105"
            >
              Reporte General
            </button>
            <button
              onClick={handleDownloadWeeklyReport}
              className="bg-[#4ab9d2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3a99b2] transition duration-300 ease-in-out transform hover:scale-105"
            >
              Reporte Semanal
            </button>
            <button
              onClick={handleDownloadMonthlyReport}
              className="bg-[#4ab9d2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3a99b2] transition duration-300 ease-in-out transform hover:scale-105"
            >
              Reporte Mensual
            </button>
            <button
              onClick={handleDownloadYearlyReport}
              className="bg-[#4ab9d2] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#3a99b2] transition duration-300 ease-in-out transform hover:scale-105"
            >
              Reporte Anual
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
