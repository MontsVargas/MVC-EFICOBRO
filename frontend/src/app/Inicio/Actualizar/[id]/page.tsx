"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type Compra = {
  id: number;
  cantidadServicio: number;
  servicioId: number;
  plantaId: number;
  tipoServicioId: number;
  direccionCompra: string;
};

type Servicio = {
  id: number;
  nombre: string;
};

type Planta = {
  id: number;
  nombre: string;
};

type TipoServicio = {
  id: number;
  nombre: string;
};

export default function ActualizarCompra() {
  const router = useRouter();
  const params = useParams();
  const idNumber = parseInt(params.id as string, 10);

  const [compra, setCompra] = useState<Compra | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/obtener/${idNumber}`);
        if (!response.ok) throw new Error("Error al cargar los datos de la compra");
        const data = await response.json();
        console.log(data);
        setCompra({
          id: data.id,
          cantidadServicio: data.cantidadServicio,
          servicioId: data.servicioId,
          plantaId: data.plantaId,
          tipoServicioId: data.servicio.Tiposervicio.id,
          direccionCompra: data.direccionCompra,
        });
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la compra.");
      }
    };

    const fetchServicios = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/servicios`);
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    const fetchPlantas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/plantas`);
        const data = await res.json();
        setPlantas(data);
      } catch (error) {
        console.error("Error al cargar plantas:", error);
      }
    };

    const fetchTiposServicio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/tiposServicio`);
        const data = await res.json();
        setTiposServicio(data);
      } catch (error) {
        console.error("Error al cargar tipos de servicio:", error);
      }
    };

    if (idNumber) {
      fetchCompra();
      fetchServicios();
      fetchPlantas();
      fetchTiposServicio();
    }
  }, [idNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!compra) return;

    setCompra({
      ...compra,
      [name]: name === "cantidadServicio" || name === "servicioId" || name === "plantaId" || name === "tipoServicioId"
        ? parseInt(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compra) return;

    const { tipoServicioId, ...datosAEnviar } = compra;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/compras/${idNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });

      if (!response.ok) throw new Error("Error al actualizar la compra");

      alert("Compra actualizada con éxito");
      router.push("/compras");
    } catch (error) {
      console.error(error);
      setError("Hubo un error al actualizar la compra");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actualizar Compra</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {compra ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cantidadServicio" className="block text-gray-700">Cantidad de Servicio</label>
            <input
              type="number"
              name="cantidadServicio"
              id="cantidadServicio"
              value={compra.cantidadServicio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="direccionCompra" className="block text-gray-700">Dirección de Compra</label>
            <input
              type="text"
              name="direccionCompra"
              id="direccionCompra"
              value={compra.direccionCompra}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="servicioId" className="block text-gray-700">Servicio</label>
            <select
              name="servicioId"
              id="servicioId"
              value={compra.servicioId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="plantaId" className="block text-gray-700">Planta</label>
            <select
              name="plantaId"
              id="plantaId"
              value={compra.plantaId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecciona una planta</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipoServicioId" className="block text-gray-700">Tipo de Servicio</label>
            <select
              name="tipoServicioId"
              id="tipoServicioId"
              value={compra.tipoServicioId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option value="">Selecciona un tipo de servicio</option>
              {tiposServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">El tipo de servicio no puede actualizarse.</p>
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
