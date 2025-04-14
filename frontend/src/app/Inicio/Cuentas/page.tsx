
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import debounce from "just-debounce-it";

type ClienteSugerido = { id: number; nombre: string };

export default function Cuentas() {
  const [nombreInput, setNombreInput] = useState("");
  const [nombre, setNombre] = useState("");
  const [mesCliente, setMesCliente] = useState("");
  const [añoCliente, setAñoCliente] = useState("");
  const [mesMensual, setMesMensual] = useState("");
  const [añoMensual, setAñoMensual] = useState(new Date().getFullYear().toString());
  const [añoAnual, setAñoAnual] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState<string | null>(null);
  const [clientesSugeridos, setClientesSugeridos] = useState<ClienteSugerido[]>([]);
  const [clienteDetalle, setClienteDetalle] = useState<any>(null);

  const buscarCliente = async (nombre: string) => {
    if (!nombre.trim()) {
      setClientesSugeridos([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}buscar/buscar?nombre=${encodeURIComponent(nombre)}`
      );
      const data = await res.json();
      setClientesSugeridos(data.clientes || []);
    } catch (error) {
      setClientesSugeridos([]);
    }
  };

  const debounceCliente = useCallback(
    debounce(async (valor: string) => {
      await buscarCliente(valor);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombreInput(valor);
    debounceCliente(valor);
  };

  const mostrarCliente = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}buscar/ver/${id}`);
      const data = await res.json();
      setClienteDetalle(data);
    } catch (error) {
      setError("No se pudo obtener los detalles del cliente.");
    }
  };

  const esAñoValido = (valor: string) => /^\d{4}$/.test(valor);
  const esMesValido = (valor: string) => /^(0[1-9]|1[0-2])$/.test(valor);

  const handleDownload = async (url: string, filename: string) => {
    try {
      setError(null);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al generar el reporte");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError("No se pudo generar el reporte");
    }
  };

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

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300 space-y-4">
        <motion.input
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          type="text"
          placeholder="Nombre del cliente"
          value={nombreInput}
          onChange={handleChange}
          className="p-3 w-full border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {clientesSugeridos.length > 0 && (
          <ul className="mt-2 max-h-48 overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-300">
            {clientesSugeridos.map((cliente) => (
              <li
                key={cliente.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  mostrarCliente(cliente.id);
                  setNombreInput(cliente.nombre);
                  setNombre(cliente.nombre);
                  setClientesSugeridos([]);
                }}
              >
                {cliente.nombre}
              </li>
            ))}
          </ul>
        )}

        {clienteDetalle && (
          <div className="mt-4 p-4 border bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold">{clienteDetalle.nombre}</h2>
            <p>Dirección: {clienteDetalle.direccion}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Mes (opcional, ej: 01)"
            value={mesCliente}
            onChange={(e) => setMesCliente(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Año (opcional, ej: 2024)"
            value={añoCliente}
            onChange={(e) => setAñoCliente(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!nombre.trim()) {
                setError("Por favor ingresa un nombre de cliente.");
                return;
              }
              if (mesCliente && !esMesValido(mesCliente)) {
                setError("El mes del cliente debe tener formato 01-12.");
                return;
              }
              if (añoCliente && !esAñoValido(añoCliente)) {
                setError("El año del cliente debe tener 4 dígitos.");
                return;
              }
              handleDownload(
                `${process.env.NEXT_PUBLIC_API_URL}pdf/cliente/nombre?nombre=${encodeURIComponent(nombre)}&mes=${mesCliente}&año=${añoCliente}`,
                `estado_cuenta_cliente_${nombre}.pdf`
              );
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte Cliente
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              handleDownload(
                `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/generales`,
                "reporte_general.pdf"
              )
            }
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Reporte General
          </motion.button>

          <div className="col-span-full grid grid-cols-2 gap-4">
            <select
              value={mesMensual}
              onChange={(e) => setMesMensual(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Mes</option>
              {["01","02","03","04","05","06","07","08","09","10","11","12"].map((mes) => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Año"
              value={añoMensual}
              onChange={(e) => setAñoMensual(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!esMesValido(mesMensual)) {
                setError("Selecciona un mes válido para el reporte mensual.");
                return;
              }
              if (!esAñoValido(añoMensual)) {
                setError("El año debe tener 4 dígitos.");
                return;
              }
              handleDownload(
                `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/mensuales?mes=${mesMensual}&año=${añoMensual}`,
                `reporte_mensual_${mesMensual}_${añoMensual}.pdf`
              );
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 col-span-full"
          >
            Reporte Mensual
          </motion.button>

          <input
            type="text"
            placeholder="Año"
            value={añoAnual}
            onChange={(e) => setAñoAnual(e.target.value)}
            className="col-span-full p-3 border border-gray-300 rounded-lg"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!esAñoValido(añoAnual)) {
                setError("El año debe tener 4 dígitos.");
                return;
              }
              handleDownload(
                `${process.env.NEXT_PUBLIC_API_URL}pdf/reportes/anuales?year=${añoAnual}`,
                `reporte_anual_${añoAnual}.pdf`
              );
            }}
            className="col-span-full bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800"
          >
            Reporte Anual
          </motion.button>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </main>
  );
}
