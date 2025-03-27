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
  tieneContrato: string; // "Sí" o "No"
}

export default function ClientesNuevos() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ClienteNuevo>({
    resolver: zodResolver(clienteNuevoSchema),
  });

  const onSubmit = async (data: ClienteNuevo) => {
    try {
      // Convertimos la opción "Sí" o "No" a un número o null
      const clienteData = {
        ...data,
        contrato_id: data.tieneContrato === "Sí" ? 1 : null, // 1 representa que tiene contrato
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cliente/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(clienteData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.mensaje || "Error al agregar cliente");

      router.push("/Inicio/Clientes");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <motion.div
        className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">
          Información del Cliente Nuevo
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Nombre</label>
            <input
              type="text"
              {...register("nombre")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese el nombre del cliente"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Dirección</label>
            <input
              type="text"
              {...register("direccion")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese la dirección del cliente"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Teléfono</label>
            <input
              type="text"
              {...register("telefono")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese el teléfono del cliente"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Dependencia (Opcional)</label>
            <input
              type="text"
              {...register("nombreDependencia")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese la dependencia si aplica"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">ID Medidor</label>
            <input
              type="text"
              {...register("id_medidor")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese el ID del medidor"
            />
          </div>

          {/* Selección de Contrato */}
          <div>
            <label className="block text-lg font-medium mb-2 text-black">¿Tiene contrato?</label>
            <select
              {...register("tieneContrato")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
            >
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-[#195c97] text-white py-2 px-6 rounded-md hover:bg-[#6aa3af] transition"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
