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
  id: number;
  nombre: string;
};

export default function SeleccionServicio() {
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoServicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({
    tipoServicio: "",
    servicio: "",
    cifra: "",
    costo: "",
    direccion: "",
    planta: "",
    nombre: "",
  });

  useEffect(() => {
    const fetchTiposDeServicio = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios/tipo`);
        const data = await response.json();
        setTiposDeServicio(data.tiposervicio || []);
      } catch (error) {
        console.error("Error al obtener los tipos de servicio:", error);
        setMensaje("No se pudieron cargar los tipos de servicio.");
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios`);
        const data = await response.json();
        setServicios(data.servicios || []);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    const fetchPlantas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/plantas`);
        const data = await response.json();
        setPlantas(data.plantas || []);
      } catch (error) {
        console.error("Error al obtener las plantas:", error);
      }
    };

    fetchTiposDeServicio();
    fetchServicios();
    fetchPlantas();
  }, []);

  useEffect(() => {
    if (tipoSeleccionado) {
      const filtrados = servicios.filter(
        (servicio) => servicio.TipoServicioId === parseInt(tipoSeleccionado)
      );
      setServiciosFiltrados(filtrados);
    } else {
      setServiciosFiltrados([]);
    }
  }, [tipoSeleccionado, servicios]);

  const handleTipoServicioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoSeleccionado(event.target.value);
    setForm({ ...form, tipoServicio: event.target.value, servicio: "" });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requestBody = {
      clienteId: 1,  // Este es un ejemplo, asegúrate de que el clienteId provenga de algún campo o esté bien asignado
      servicioId: Number(form.servicio),  // Este es el id del servicio seleccionado
      cantidadServicio: Number(form.cifra),  // Este es el número de servicios
      cobro: Number(form.costo),  // El cobro total del servicio
      direccionCompra: form.direccion,  // Dirección de compra
      plantaId: Number(form.planta),  // El id de la planta seleccionada
    };

    console.log(requestBody); // Asegúrate de que los datos sean correctos

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setMensaje("Compra realizada con éxito.");
      } else {
        const errorData = await response.json();
        setMensaje(errorData.mensaje || "No se pudo completar la compra.");
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      setMensaje("Error en la compra.");
    }
  };

  return (
    <main className="flex-grow p-6 bg-white">
      <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Seleccionar un Servicio</h2>

        {/* Mostrar mensaje de éxito o error */}
        {mensaje && (
          <div
            className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-green-500" : "text-red-500"}`}
          >
            {mensaje}
          </div>
        )}

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

          {/* Campos adicionales para la compra */}
          {[ 
            { label: "Nombre del Cliente", name: "nombre", type: "text" },
            { label: "Cifra de Servicio", name: "cifra", type: "text" },
            { label: "Costo del Servicio", name: "costo", type: "number", step: "0.01" },
            { label: "Dirección de Compra", name: "direccion", type: "text" },
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
                required={["nombre", "cifra", "costo"].includes(name)}
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
