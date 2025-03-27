"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Cliente = {
  id: number;
  nombre: string;
  direccion: string;
};

export default function ActualizarCliente({ cliente }: { cliente: Cliente }) {
  const [nombre, setNombre] = useState(cliente.nombre);
  const [direccion, setDireccion] = useState(cliente.direccion);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}cliente/${cliente.id}`, 
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            direccion,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error al actualizar cliente");
        return;
      }

      alert("Cliente actualizado correctamente");
      router.push("/clientes"); // Redirige a la lista de clientes
    } catch (error) {
      alert("Error en la actualización");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actualizar Cliente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-gray-700">Nombre</label>
          <input
            type="text"
            id="nombre"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="direccion" className="block text-gray-700">Dirección</label>
          <input
            type="text"
            id="direccion"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Cliente"}
        </button>
      </form>
    </motion.div>
  );
}
