"use client"
import { FieldErrors, useForm } from "react-hook-form";
import Image from 'next/image';
import iniciarSesionSchema from "@/schemas/iniciar-sesion-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function IniciarSesion() {
    const router = useRouter();
    const { register, handleSubmit } = useForm<{ usuarios: string; contraseña: string }>({
        resolver: zodResolver(iniciarSesionSchema)
    });

    const onSuccess = async (data: { usuarios: string; contraseña: string }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}usuario/iniciarSesion`, {
                method: "POST",
                body: JSON.stringify({ correo: data.usuarios, contrasenia: data.contraseña }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message); // Muestra mensaje de error
                return;
            }

            const message = await response.json();
            alert(message.mensaje); // Muestra mensaje de éxito
            router.push("/Inicio");// Te redirige a la pagina de inicio si es exitoso
        } catch {
            alert("Error al iniciar sesión"); 
        }
    };
    const onError = (errors: FieldErrors) => {
        let errorMessages = '';
        Object.entries(errors).forEach(([, value]) => {
            if (value && value.message) {
                errorMessages += value.message + '\n'; //  agrega si hay un mensaje
            }
        });
        alert(errorMessages.trim()); 
    };
    
    return (
        <div 
            className="flex justify-center items-center min-h-screen bg-blue-800" 
            style={{ 
                backgroundImage: 'url("/Imagen1.svg")', 
                backgroundSize: 'contain', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'left' 
            }}
        >
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-8 rounded-lg w-96 bg-white border border-white shadow-md"
            >
                <div className="flex justify-center mb-4">
                    <Image src="/iniciarSesion.svg" alt="Clientes Icon" width={150} height={150} />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">BIENVENIDO</h2>
                <form onSubmit={handleSubmit(onSuccess, onError)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">USUARIO</label>
                        <input 
                            id="email" 
                            type="email" 
                            {...register("usuarios")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">CONTRASEÑA</label>
                        <input 
                            id="password" 
                            type="password" 
                            {...register("contraseña")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                            placeholder="******** "
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Acceder
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

