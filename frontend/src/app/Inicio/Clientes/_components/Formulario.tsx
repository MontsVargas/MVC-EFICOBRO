"use client"

import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import debounce from 'just-debounce-it';

type Cliente = {
    nombre: string;
    direccion: string;
    contrato_id?: number;
};

export default function Formulario() {

    const [nombre, setNombre] = useState('');
    const [clientes, setClientes] = useState<Cliente[]>([]);

    async function buscarCliente(cliente: string) {
        try {
            if (cliente === '') {
                setClientes([]);
                return;
            }
           const response = await fetch ('http://localhost:4000/cliente/buscar?nombre=${cliente}', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials: 'include'
           });
         
           if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || 'Error desconocido');
            return;
        }

        const data = await response.json();
        setClientes(data.clientes || []);
        } catch {
            alert('Error al buscar clientes');
        }
    }

    const debounceCliente = useCallback(
        debounce(async (nombre: string) => {
            await buscarCliente(nombre);
        }, 1000),
        []
    )

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        buscarCliente(nombre);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nuevoNombre = e.target.value;
        setNombre(nuevoNombre);
        debounceCliente(nuevoNombre);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="" id=""
                    className="bg-white border-2 border-black text-black py-2 px-4 rounded"
                    onChange={handleChange}
                />
                <button type="submit" className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">
                    Buscar
                </button>
            </form>

            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border border-blue-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="p-4 text-left">Nombre</th>
                        <th className="p-4 text-left">Dirección</th>
                        <th className="p-4 text-left">Contrato ID</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, index) => (
                        <tr
                            key={index}
                            className="border-b border-blue-200 hover:bg-blue-100 transition"
                        >
                            <td className="p-4 text-blue-900">{cliente.nombre}</td>
                            <td className="p-4 text-blue-900">{cliente.direccion}</td>
                            <td className="p-4 text-blue-900">
                                {cliente.contrato_id ? cliente.contrato_id : "Sin Contrato"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}