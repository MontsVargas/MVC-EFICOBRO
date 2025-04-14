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
  TipoServicioId: number;
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
  const [filteredServicios, setFilteredServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/obtener/${idNumber}`);
        if (!response.ok) throw new Error("Error al cargar los datos de la compra");
        const data = await response.json();
        setCompra({
          id: data.id,
          cantidadServicio: data.cantidadServicio,
          servicioId: data.servicioId,
          plantaId: data.plantaId,
          tipoServicioId: data.servicio?.Tiposervicio?.id ?? 0,
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
        setServicios(Array.isArray(data.servicios) ? data.servicios : []);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        setServicios([]);
      }
    };

    const fetchPlantas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/plantas`);
        const data = await res.json();
        setPlantas(Array.isArray(data.plantas) ? data.plantas : []);
      } catch (error) {
        console.error("Error al cargar plantas:", error);
        setPlantas([]);
      }
    };

    const fetchTiposServicio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/tiposServicio`);
        const data = await res.json();
        setTiposServicio(Array.isArray(data.tiposServicio) ? data.tiposServicio : []);
      } catch (error) {
        console.error("Error al cargar tipos de servicio:", error);
        setTiposServicio([]);
      }
    };

    if (idNumber) {
      fetchCompra();
      fetchServicios();
      fetchPlantas();
      fetchTiposServicio();
    }
  }, [idNumber]);

  useEffect(() => {
    if (compra?.tipoServicioId) {
      const serviciosFiltrados = servicios.filter(
        (servicio) => servicio.TipoServicioId === compra.tipoServicioId
      );
      setFilteredServicios(serviciosFiltrados);
    }
  }, [compra, servicios]);

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

  if (!compra) {
    return <p className="text-center text-gray-600">Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Actualizar Compra</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cantidadServicio" className="block font-semibold text-gray-700 mb-1">Cantidad de Servicio</label>
          <input
            type="number"
            name="cantidadServicio"
            id="cantidadServicio"
            value={compra.cantidadServicio || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="direccionCompra" className="block font-semibold text-gray-700 mb-1">Dirección de Compra</label>
          <input
            type="text"
            name="direccionCompra"
            id="direccionCompra"
            value={compra.direccionCompra || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="tipoServicioId" className="block font-semibold text-gray-700 mb-1">Tipo de Servicio</label>
          <select
            name="tipoServicioId"
            id="tipoServicioId"
            value={compra.tipoServicioId || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecciona un tipo de servicio</option>
            {Array.isArray(tiposServicio) && tiposServicio.length ? (
              tiposServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>Cargando tipos de servicio...</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="servicioId" className="block font-semibold text-gray-700 mb-1">Servicio</label>
          <select
            name="servicioId"
            id="servicioId"
            value={compra.servicioId || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecciona un servicio</option>
            {Array.isArray(filteredServicios) && filteredServicios.length ? (
              filteredServicios.map((servicio) => (
                <option className="text-black" key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay servicios disponibles</option>
            )}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="plantaId" className="block font-semibold text-gray-700 mb-1">Planta</label>
          <select
            name="plantaId"
            id="plantaId"
            value={compra.plantaId || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecciona una planta</option>
            {Array.isArray(plantas) && plantas.length ? (
              plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay plantas disponibles</option>
            )}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Actualizar Compra
          </button>
        </div>
      </form>
    </div>
  );
}
