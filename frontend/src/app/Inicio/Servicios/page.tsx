"use client";
import { useState, useEffect } from "react";

type TipoServicio = {
  id: number;
  nombre: string;
};

type Servicio = {
  id: number;
  descripcion: string;
  TipoServicioId: number;
};

type Planta = {
  id: string;
  nombre: string;
};

export default function Servicios() {
  const [form, setForm] = useState({
    nombre: "",
    servicio: "",
    tipoServicio: "",
    fecha: "",
    cifra: "",
    unidad: "cifra", // Unidades: "cifra" o "metrosCubicOs"
    planta: "",
    clienteId: "",
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoServicio[]>([]);

  // servicios, plantas y tipos de servicio
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
        setServicios(data.servicios);
        setServiciosFiltrados(data.servicio || []); // Al principio mostramos todos los servicios
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

        if (!response.ok) {
          console.error("Error al obtener los tipos de servicio");
          setMensaje("No se pudieron cargar los tipos de servicio.");
          return;
        }

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

  // Filtrar los servicios cuando el tipo de servicio cambie
  const handleTipoServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoSeleccionado = e.target.value;
    setForm({ ...form, tipoServicio: tipoSeleccionado });

    if (tipoSeleccionado) {
      const serviciosFiltrados = servicios.filter(
        (servicio) => servicio.TipoServicioId === parseInt(tipoSeleccionado)
      );
      setServiciosFiltrados(serviciosFiltrados);
    } else {
      setServiciosFiltrados(servicios); // Si no hay tipo seleccionado, mostramos todos los servicios
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, unidad: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!form.nombre || !form.servicio || !form.fecha || !form.tipoServicio || !form.planta) {
      setMensaje("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const requestBody = {
      nombreCliente: form.nombre, // Se envía el nombre del cliente
      servicioId: Number(form.servicio), // el dato se envia como número
      cantidadServicio: Number(form.cifra), // el dato se envia como número
      unidadServicio: form.unidad, // Se añade la unidad seleccionada
      plantaId: Number(form.planta), // tipo numero
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
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
        unidad: "cifra", // Restablecer a cifra por defecto
        planta: "",
        clienteId: "",
      });
    } catch (error) {
      setMensaje((error as Error).message);
    }
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Seleccionar un Servicio</h2>
        {mensaje && <div className="text-center text-blue-700 mb-4">{mensaje}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              onChange={handleTipoServicioChange}
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
              {serviciosFiltrados.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.descripcion}
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
          {/* Tipo de unidad (Cifra o Metros Cúbicos) */}
          <div>
            <label htmlFor="unidad" className="block text-lg font-medium mb-2 text-black">
              Tipo de Unidad
            </label>
            <select
              id="unidad"
              name="unidad"
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              value={form.unidad}
              onChange={handleUnitChange}
              required
            >
              <option value="cifra">Cifra</option>
              <option value="metrosCubicos">Metros Cúbicos</option>
            </select>
          </div>
          {/* Consumo */}
          <div>
            <label htmlFor="cifra" className="block text-lg font-medium mb-2 text-black">
              Consumo
            </label>
            <input
              id="cifra"
              name="cifra"
              type="text"
              className="w-full p-3 border border-gray-400 rounded-md text-black"
              placeholder={form.unidad === "cifra" ? "Ingrese la cifra" : "Ingrese los metros cúbicos"}
              value={form.cifra}
              onChange={handleChange}
              required
            />
          </div>
          {/* Campos de llenado manual */}
          {[ 
             { label: "Nombre del Cliente", name: "nombre", type: "text" },
             { label: "Fecha de Contratación", name: "fecha", type: "date" }
            ].map(({ label, name, type }) => (
           <div key={name}>
    <label htmlFor={name} className="block text-lg font-medium mb-2 text-black">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      className="w-full p-3 border border-gray-400 rounded-md text-black"
      placeholder="Ingrese información"
      value={form[name as keyof typeof form]}
      onChange={handleChange}
      required
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
