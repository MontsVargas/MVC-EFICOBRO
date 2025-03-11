"use client";
import { useState, useEffect } from "react";

type TipoServicio = {
  id: number;
  nombre: string;
};

type Servicio = {
  id: number;
  descripcion: string;
};

type Planta = {
  id: number;
  nombre: string;
};

export default function Servicios() {
  const [form, setForm] = useState({
    nombre: "",
    servicio: "",
    tipoServicio: "",
    fecha: "",
    cifra: "",
    costo: "",
    direccion: "",
    planta: "",
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoServicio[]>([]);

  // Obtener servicios, plantas y tipos de servicio
  useEffect(() => {
    async function fetchServicios() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener los servicios");

        const data = await response.json();
        setServicios(Array.isArray(data.servicios) ? data.servicios : []);
      } catch (error) {
        console.error("Error:", error);
        setMensaje("No se pudieron cargar los servicios.");
      }
    }

    async function fetchPlantas() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/plantas`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener las plantas");

        const data = await response.json();
        setPlantas(Array.isArray(data.plantas) ? data.plantas : []);
      } catch (error) {
        console.error("Error:", error);
        setMensaje("No se pudieron cargar las plantas.");
      }
    }

    async function fetchTiposDeServicio() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios/tipo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener los tipos de servicio");

        const data = await response.json();
        console.log("Tipos de servicio recibidos:", data); 
        setTiposDeServicio(Array.isArray(data.tiposervicio) ? data.tiposervicio : []);
      } catch (error) {
        console.error("Error:", error);
        setMensaje("No se pudieron cargar los tipos de servicio.");
      }
    }

    fetchServicios();
    fetchPlantas();
    fetchTiposDeServicio();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!form.nombre || !form.servicio || !form.fecha || !form.costo || !form.tipoServicio || !form.planta) {
      setMensaje("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al crear servicio");

      setMensaje("Servicio agregado con éxito.");
      setForm({
        nombre: "",
        servicio: "",
        tipoServicio: "",
        fecha: "",
        cifra: "",
        costo: "",
        direccion: "",
        planta: "",
      });
    } catch (error) {
      setMensaje((error as Error).message);
    }
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Seleccionar un Servicio</h2>
        {mensaje && <div className="text-center text-red-500 mb-4">{mensaje}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Selección de servicio */}
          <div>
            <label htmlFor="servicio" className="block text-lg font-medium mb-2 text-black">
              Servicio a Contratar
            </label>
            <select
              id="servicio"
              name="servicio"
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              value={form.servicio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.descripcion}>
                  {servicio.descripcion}
                </option>
              ))}
            </select>
          </div>
          {/* Tipo de servicio */}
          <div>
            <label htmlFor="tipoServicio" className="block text-lg font-medium mb-2 text-black">
              Tipo de Servicio
            </label>
            <select
              id="tipoServicio"
              name="tipoServicio"
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              value={form.tipoServicio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Selección de planta */}
          <div>
            <label htmlFor="planta" className="block text-lg font-medium mb-2 text-black">
              Planta
            </label>
            <select
              id="planta"
              name="planta"
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              value={form.planta}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una planta</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* Campos de llenado manual */}
          {[ 
            { label: "Nombre del Cliente", name: "nombre", type: "text" },
            { label: "Fecha de Contratación", name: "fecha", type: "date" },
            { label: "Cifra de Servicio", name: "cifra", type: "text" },
            { label: "Costo del Servicio", name: "costo", type: "number", step: "0.01" },
            { label: "Dirección", name: "direccion", type: "text" },
          ].map(({ label, name, type, step }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-lg font-medium mb-2 text-black">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                step={step}
                className="w-full p-3 border border-gray-400 rounded-md text-black"
                placeholder="Ingrese información"
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required={["nombre", "fecha", "costo"].includes(name)}
              />
            </div>
          ))}
          {/* Botón de enviar */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-[#195c97] text-white py-2 px-6 rounded-md hover:bg-[#6aa3af] transition"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
