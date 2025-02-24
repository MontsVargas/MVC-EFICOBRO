"use client";

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import debounce from "just-debounce-it";

type Cliente = {
    nombre: string;
    direccion: string;
    contrato_id?: number;
};

export default function Formulario() {
    const [nombre, setNombre] = useState("");
    const [clientes, setClientes] = useState<Cliente[]>([]);

    async function buscarCliente(cliente: string) {
        try {
            if (!cliente.trim()) {
                setClientes([]);
                return;
            }

            const response = await fetch(`http://localhost:4000/cliente/buscar?nombre=${cliente}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error en la búsqueda:", errorData.message || "Error desconocido");
                return;
            }

            const data = await response.json();
            setClientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al buscar clientes:", error);
        }
    }

    const debounceCliente = useCallback(
        debounce(async (nombre: string) => {
            await buscarCliente(nombre);
        }, 1000),
        []
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        buscarCliente(nombre);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nuevoNombre = e.target.value;
        setNombre(nuevoNombre);
        debounceCliente(nuevoNombre);
    };

    return (
        <div className="flex flex-col items-center p-6">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                    Buscar Cliente
                </button>
                <input
                    type="text"
                    className="mt-3 w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={nombre}
                    onChange={handleChange}
                    placeholder="Escribe el nombre del cliente..."
                />
            </form>

            {/* Resultados */}
            {clientes.length > 0 ? (
                <div className="w-full max-w-2xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientes.map((cliente, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{cliente.nombre}</h3>
                            <p className="text-black">{cliente.direccion}</p>
                            <p className="text-sm text-black">
                                {cliente.contrato_id ? `Contrato ID: ${cliente.contrato_id}` : "Sin Contrato"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No se encontraron clientes.</p>
            )}
        </div>
    );
}
