"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TipoServicio = { id: number; nombre: string };
type Servicio = { id: number; descripcion: string; TipoServicioId: number };
type Planta = { id: number; nombre: string };
type Cliente = { id: number; nombre: string };

export default function SeleccionServicio() {
  const [tiposDeServicio, setTiposDeServicio] = useState<TipoServicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("");
  const [unidadMedida, setUnidadMedida] = useState<string>("cifra");
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    clienteId: "",
    tipoServicio: "",
    servicio: "",
    cantidad: "",
    costo: "",
    direccion: "",
    planta: "",
    mesCompra: "",
    anioCompra: "", 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipo, servicios, plantas, clientes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios/tipo`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/servicios`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/plantas`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/cliente`).then(res => res.json()),
        ]);
        setTiposDeServicio(tipo.tiposervicio || []);
        setServicios(servicios.servicios || []);
        setPlantas(plantas.plantas || []);
        setClientes(clientes.clientes || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setMensaje("Error al cargar los datos.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tipoSeleccionado) {
      const filtrados = servicios.filter((s) => s.TipoServicioId === parseInt(tipoSeleccionado));
      setServiciosFiltrados(filtrados);
    } else {
      setServiciosFiltrados([]);
    }
  }, [tipoSeleccionado, servicios]);

  const handleTipoServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoSeleccionado(e.target.value);
    setForm({ ...form, tipoServicio: e.target.value, servicio: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      clienteId: Number(form.clienteId),
      servicioId: Number(form.servicio),
      cantidadServicio: Number(form.cantidad),
      unidadMedida,
      cobro: Number(form.costo),
      direccionCompra: form.direccion,
      plantaId: Number(form.planta),
      mesCompra: form.mesCompra || undefined,
      anioCompra: form.anioCompra || undefined,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}servicios/compras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.mensaje || "No se pudo realizar la compra.");
      } else {
        setMensaje("Compra realizada con éxito.");
        console.log("Compra registrada:", data);
        setForm({
          clienteId: "",
          tipoServicio: "",
          servicio: "",
          cantidad: "",
          costo: "",
          direccion: "",
          planta: "",
          mesCompra: "",
          anioCompra: "",
        });
      }
    } catch (err) {
      console.error("Error en la compra:", err);
      setMensaje("Error al realizar la compra.");
    }
  };

  return (
    <main className="flex-grow p-6 bg-[#f0f8fb]">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg"
      >
        <h2 className="text-center text-3xl font-semibold mb-8 text-[#195c97]">Registrar Compra</h2>

        {mensaje && (
          <div className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-blue-600" : "text-red-600"}`}>
            {mensaje}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            {
              label: "Cliente",
              name: "clienteId",
              type: "select",
              options: clientes.map(c => ({ value: c.id, label: c.nombre })),
            },
            {
              label: "Tipo de Servicio",
              name: "tipoServicio",
              type: "select",
              options: tiposDeServicio.map(t => ({ value: t.id, label: t.nombre })),
              onChange: handleTipoServicioChange,
            },
            {
              label: "Servicio",
              name: "servicio",
              type: "select",
              options: serviciosFiltrados.map(s => ({ value: s.id, label: s.descripcion })),
            },
            {
              label: "Unidad de Medida",
              name: "unidadMedida",
              type: "select",
              value: unidadMedida,
              onChange: (e: any) => setUnidadMedida(e.target.value),
              options: [
                { value: "cifra", label: "Cifra" },
                { value: "metro cubico", label: "Metro Cúbico" },
              ],
            },
            { label: "Cantidad", name: "cantidad", type: "number" },
            { label: "Costo", name: "costo", type: "number" },
            { label: "Dirección de Compra", name: "direccion", type: "text" },
            {
              label: "Planta",
              name: "planta",
              type: "select",
              options: plantas.map(p => ({ value: p.id, label: p.nombre })),
            },
          ].map((field, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={field.name === "unidadMedida" ? unidadMedida : (form as any)[field.name]}
                  onChange={field.onChange || handleChange}
                  className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Seleccione {field.label.toLowerCase()}</option>
                  {field.options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">Mes de Compra</label>
              <select
                name="mesCompra"
                value={form.mesCompra}
                onChange={handleChange}
                className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">Seleccione mes</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">Año de Compra</label>
              <input
                type="number"
                name="anioCompra"
                value={form.anioCompra}
                onChange={handleChange}
                placeholder="Ej: 2025"
                className="w-full p-4 border border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4ab9d2] to-[#5cb8d1] text-white py-3 px-8 rounded-md shadow-md hover:from-[#6aa3af] hover:to-[#74c8e0] transition duration-300 transform hover:scale-105"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
