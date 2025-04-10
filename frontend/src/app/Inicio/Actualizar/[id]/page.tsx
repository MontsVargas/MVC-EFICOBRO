"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Compra = {
  id: number;
  cantidadServicio: number;
  servicioId: number;
  plantaId: number;
  direccionCompra: string;
};

export default function ActualizarCompra({ id }: { id: string }) {
  const router = useRouter();
  const [compra, setCompra] = useState<Compra | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convertir el id a número
  const idNumber = parseInt(id, 10);

  useEffect(() => {
    if (idNumber) {
      const fetchCompra = async () => {
        try {
          console.log(`Fetching data for compra ID: ${idNumber}`);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/obtener/${idNumber}`);
          if (!response.ok) {
            throw new Error(`Error al cargar los datos de la compra: ${response.statusText}`);
          }
          const data = await response.json();
          console.log("Datos de la compra recibidos:", data);
          setCompra(data);
        } catch (error) {
          console.error("Error en el fetch de compra:", error);
          setError("No se pudo cargar la compra.");
        }
      };

      fetchCompra();
    }
  }, [idNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (compra) {
      try {
        console.log("Enviando datos de actualización:", compra);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/compras/${idNumber}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cantidadServicio: compra.cantidadServicio,
            direccionCompra: compra.direccionCompra,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar la compra");
        }

        alert("Compra actualizada con éxito");
        router.push("/compras"); // Redirigir a la lista de compras
      } catch (error) {
        console.error("Error en la actualización de la compra:", error);
        setError("Hubo un error al actualizar la compra");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (compra) {
      console.log(`Cambiando ${name} a ${value}`);
      setCompra({
        ...compra,
        [name]: name === "cantidadServicio" ? parseInt(value) : value, // Convierte a número si es cantidadServicio
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actualizar Compra</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {compra ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cantidadServicio" className="block text-gray-700">
              Cantidad de Servicio
            </label>
            <input
              type="number"
              id="cantidadServicio"
              name="cantidadServicio"
              value={compra.cantidadServicio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="direccionCompra" className="block text-gray-700">
              Dirección de Compra
            </label>
            <input
              type="text"
              id="direccionCompra"
              name="direccionCompra"
              value={compra.direccionCompra || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => router.push("/compras")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <p>Cargando datos de la compra...</p>
      )}
    </div>
  );
}
