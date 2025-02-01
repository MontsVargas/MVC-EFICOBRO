"use client"
import { FieldErrors, useForm } from "react-hook-form";
import Image from 'next/image';
import Link from 'next/link';
import iniciarSesionSchema from "@/schemas/iniciar-sesion-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function IniciarSesion() {
    const router = useRouter();
    const { register, handleSubmit } = useForm<{usuarios: string, contraseña: string}>({
        resolver: zodResolver(iniciarSesionSchema),
    });const onSuccess = () => {
        router.push("/Inicio");
    };

    const onError = (errors: FieldErrors) => {
        console.log(errors);
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
            <div className="p-8 rounded-lg w-96 bg-white border border-white shadow-md">
                <div className="flex justify-center mb-4">
                    <Image src="/iniciarSesion.svg" alt="Clientes Icon" width={150} height={150} />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">BIENVENIDO</h2>
                <form onSubmit={handleSubmit(onSuccess, onError)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">USUARIO</label>
                        <input 
                            id="email" 
                            type="email" // text en caso de la elección del usuario
                            {...register("usuarios")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">CONTRASEÑA</label>
                        <input 
                            id="password" 
                            type="password" 
                            {...register("contraseña")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            placeholder="Correo electrónico"
                        />
                    </div>
                    <Link href="Inicio">
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            Acceder
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
}
