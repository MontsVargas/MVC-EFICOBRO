"use client";

import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clienteNuevoSchema from "@/schemas/info-cliente-nuevo-schema";


interface ClienteNuevo {
  nombre: string;
  direccion: string;
  telefono: string;
  nombreDependencia?: string;
  id_medidor: string;
}

export default function ClientesNuevos() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ClienteNuevo>({
    resolver: zodResolver(clienteNuevoSchema),
  });

  const onSubmit = async (data: ClienteNuevo) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cliente/clientes`, {
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

  const onError = (errors: FieldErrors) => {
    let errorMessages = "";
    Object.entries(errors).forEach(([, value]) => {
      if (value && value.message) {
        errorMessages += value.message + "\n"; // Agrega si hay un mensaje
      }
    });
    alert(errorMessages.trim());
  };
  return (
    <main className="flex-grow p-6 bg-[#f0f8fb]"> {/* Fondo claro */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg"
      >
        <h2 className="text-center text-3xl font-semibold mb-8 text-[#195c97]">
          Información del cliente nuevo
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
          {Object.keys(clienteNuevoSchema.shape).map((key) => (
            <div key={key} className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                {...register(key as keyof ClienteNuevo)}
                className={`w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700`}
                placeholder={`Ingrese ${key}`}
              />
            </div>
          ))}
          
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4ab9d2] to-[#5cb8d1] text-white py-3 px-8 rounded-md shadow-md hover:from-[#6aa3af] hover:to-[#74c8e0] transition duration-300 transform hover:scale-105"
            >
              AGREGAR CLIENTE
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
