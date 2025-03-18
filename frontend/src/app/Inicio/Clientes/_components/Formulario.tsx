"use client"

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir a otra página

export default function Formulario() {
    const router = useRouter();

    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [dependencia, setDependencia] = useState(''); // Campo de la zona

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const nuevoCliente = {
            nombre,
            direccion,
            dependencia,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}cliente/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(nuevoCliente),
            });

            if (!response.ok) {
                throw new Error('Error al registrar el cliente');
            }

            if (dependencia.toLowerCase() === "cariñan") {
                router.push("/Clientes-cari"); // Redirige a la página de clientes de Cariñan
            }
        } catch (error) {
            console.error("Error al registrar el cliente:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre"
                    className="bg-white border-2 border-black text-black py-2 px-4 rounded"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Dirección"
                    className="bg-white border-2 border-black text-black py-2 px-4 rounded"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Dependencia"
                    className="bg-white border-2 border-black text-black py-2 px-4 rounded"
                    value={dependencia}
                    onChange={(e) => setDependencia(e.target.value)}
                />
                <button type="submit" className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">
                    Registrar Cliente
                </button>
            </form>
        </div>
    );
}
