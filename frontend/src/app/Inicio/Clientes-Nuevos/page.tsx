"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clienteNuevoSchema from "@/schemas/info-cliente-nuevo-schema";

export default function ClientesNuevos() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
  } = useForm({ resolver: zodResolver(clienteNuevoSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:4001/cliente/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al agregar cliente");
      router.push("/Inicio/Clientes");
    } catch {
      alert("Error al agregar cliente");
    }
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg"
      >
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Información del cliente nuevo</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(clienteNuevoSchema.shape).map((key) => (
            <div key={key}>
              <label className="block text-lg font-medium mb-2 text-black">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                {...register(key)}
                className="w-full p-3 border border-gray-400 rounded-md text-black"
                placeholder="Ingrese información"
              />
            </div>
          ))}
          <div className="text-center mt-6">
            <button type="submit" className="bg-[#195c97] text-white py-2 px-6 rounded-md hover:bg-[#6aa3af] transition">
              AGREGAR
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
