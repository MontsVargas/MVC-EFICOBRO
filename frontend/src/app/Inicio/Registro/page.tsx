"use client";

import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import registroSchema from "@/schemas/registro-schema";

interface RegistroData {
    nombre: string;
    correo: string;
    contrasenia: string;
    telefono: string;
  }
  
export default function RegistroForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegistroData>({
    resolver: zodResolver(registroSchema),
  });

  const onSuccess = async (data: RegistroData) => { 
    try {
      const response = await fetch(`http://localhost:4000/registro`, {
        method: "POST", 
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      alert("Registro agregado exitosamente");
    } catch {
      alert("Error al agregar el registro");
    }
  };

  const onError = (errors: FieldErrors) => {
    let errorMessages = '';
    Object.entries(errors).forEach(([, value]) => {
      if (value && value.message) {
        errorMessages += value.message + '\n';
      }
    });
    alert(errorMessages.trim());
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Registro de Nuevo Usuario</h2>
        
        <form onSubmit={handleSubmit(onSuccess, onError)} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Nombre</label>
            <input
              type="text"
              {...register("nombre")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese su nombre"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Correo</label>
            <input
              type="email"
              {...register("correo")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese su correo"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Contraseña</label>
            <input
              type="password"
              {...register("contrasenia")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese su contraseña"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Teléfono</label>
            <input
              type="text"
              {...register("telefono")}
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder="Ingrese su número de teléfono"
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-[#195c97] text-white py-2 px-6 rounded-md hover:bg-[#6aa3af] transition"
            >
              REGISTRAR
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
