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
  TipoServicioId: number; // Asegúrate de que los servicios tengan este campo
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
        setServicios(data.servicios); // Guarda todos los servicios
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    const fetchPlantas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/plantas`);
        const data = await res.json();
        setPlantas(data.plantas);  // Guarda las plantas en el estado
      } catch (error) {
        console.error("Error al cargar plantas:", error);
        setPlantas([]);  // Establece un array vacío en caso de error
      }
    };

    const fetchTiposServicio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}actualizar/tiposServicio`);
        const data = await res.json();
        setTiposServicio(data.tiposServicio); // Guarda los tipos de servicio
      } catch (error) {
        console.error("Error al cargar tipos de servicio:", error);
        setTiposServicio([]);  // Establece un array vacío en caso de error
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
      setFilteredServicios(serviciosFiltrados); // Filtra los servicios según el tipo de servicio
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actualizar Compra</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {compra ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cantidadServicio" className="block text-black">Cantidad de Servicio</label>
            <input
              type="number"
              name="cantidadServicio"
              id="cantidadServicio"
              value={compra.cantidadServicio || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="direccionCompra" className="block text-black">Dirección de Compra</label>
            <input
              type="text"
              name="direccionCompra"
              id="direccionCompra"
              value={compra.direccionCompra || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          {/* Campo para seleccionar el tipo de servicio */}
          <div>
            <label htmlFor="tipoServicioId" className="block text-black">Tipo de Servicio</label>
            <select
              name="tipoServicioId"
              id="tipoServicioId"
              value={compra.tipoServicioId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            >
              <option value="">Selecciona un tipo de servicio</option>
              {tiposServicio?.length ? (
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
            <label htmlFor="servicioId" className="block text-black">Servicio</label>
            <select
              name="servicioId"
              id="servicioId"
              value={compra.servicioId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            >
              <option value="">Selecciona un servicio</option>
              {filteredServicios?.length ? (
                filteredServicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay servicios disponibles</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="plantaId" className="block text-black">Planta</label>
            <select
              name="plantaId"
              id="plantaId"
              value={compra.plantaId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              required
            >
              <option value="">Selecciona una planta</option>
              {plantas?.length ? (
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

          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md">Actualizar Compra</button>
        </form>
      ) : (
        <p>Cargando....</p>
      )}
    </div>
  );
}
