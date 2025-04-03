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
  const [unidadMedida, setUnidadMedida] = useState<string>("cifra");
  const [form, setForm] = useState({
    tipoServicio: "",
    servicio: "",
    cantidad: "",
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
      clienteId: 1, // Cliente ID (ajústalo según tus necesidades)
      servicioId: Number(form.servicio), // ID del servicio
      cantidadServicio: Number(form.cantidad), // Cantidad de servicio
      unidadMedida: unidadMedida, // 'cifra' o 'metro cubico'
      cobro: Number(form.costo), // Costo de la compra
      direccionCompra: form.direccion, // Dirección de la compra
      plantaId: Number(form.planta), // Planta ID
    };

    // Log para depurar el cuerpo de la solicitud
    console.log("Request Body:", requestBody);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error de servidor:", errorData); // Log de la respuesta del servidor
        setMensaje(errorData.mensaje || "No se pudo completar la compra.");
      } else {
        setMensaje("Compra realizada con éxito.");
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      setMensaje("Error en la compra.");
    }
  };

  return (
    <main className="flex-grow p-6 bg-[#f0f8fb]">
      <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-semibold mb-8 text-[#195c97]">Seleccionar un Servicio</h2>

        {mensaje && (
          <div className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-blue-500" : "text-black"}`}>
            {mensaje}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium mb-2 text-black">Nombre del cliente</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Tipo de Servicio</label>
            <select
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.tipoServicio}
              onChange={handleTipoServicioChange}
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Servicio</label>
            <select
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.servicio}
              onChange={handleChange}
              name="servicio"
            >
              <option value="">Seleccione un servicio</option>
              {serviciosFiltrados.map((servicio) => (
                <option key={servicio.id} value={servicio.id.toString()}>
                  {servicio.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Unidad de Medida</label>
            <select
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
            >
              <option value="cifra">Cifra</option>
              <option value="metro cubico">Metro Cúbico</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Planta</label>
            <select
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.planta}
              onChange={handleChange}
              name="planta"
            >
              <option value="">Seleccione una planta</option>
              {plantas.map((planta) => (
                <option key={planta.id} value={planta.id.toString()}>
                  {planta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              placeholder={`Ingrese la cantidad en ${unidadMedida}`}
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.cantidad}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Costo</label>
            <input
              type="number"
              name="costo"
              placeholder="Ingrese el costo"
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.costo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2 text-black">Dirección de Compra</label>
            <input
              type="text"
              name="direccion"
              placeholder="Ingrese la dirección"
              className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4a5ad2] to-[#205abe] text-white py-3 px-8 rounded-md shadow-md hover:from-[#6aa3af] hover:to-[#74c8e0] transition duration-300 transform hover:scale-105"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
