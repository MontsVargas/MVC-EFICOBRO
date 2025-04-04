"use client";
import { useEffect, useState } from "react";

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
      const filtrados = servicios.filter(
        (s) => s.TipoServicioId === parseInt(tipoSeleccionado)
      );
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
      }
    } catch (err) {
      console.error("Error en la compra:", err);
      setMensaje("Error al realizar la compra.");
    }
  };

  return (
    <main className="flex-grow p-6 bg-[#f0f8fb]">
      <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 shadow-lg rounded-lg">
        <h2 className="text-3xl text-center font-bold mb-6 text-[#195c97]">Registrar Compra</h2>

        {mensaje && (
          <div className={`text-center mb-4 ${mensaje.includes("éxito") ? "text-blue-600" : "text-red-600"}`}>
            {mensaje}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-black font-medium mb-2">Cliente</label>
            <select
              name="clienteId"
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
              value={form.clienteId}
              onChange={handleChange}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Tipo de Servicio</label>
            <select
              value={form.tipoServicio}
              onChange={handleTipoServicioChange}
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Servicio</label>
            <select
              name="servicio"
              value={form.servicio}
              onChange={handleChange}
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            >
              <option value="">Seleccione un servicio</option>
              {serviciosFiltrados.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Unidad de Medida</label>
            <select
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            >
              <option value="cifra">Cifra</option>
              <option value="metro cubico">Metro Cúbico</option>
            </select>
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Cantidad"
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Costo</label>
            <input
              type="number"
              name="costo"
              value={form.costo}
              onChange={handleChange}
              placeholder="Costo"
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Dirección de Compra</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Planta</label>
            <select
              name="planta"
              value={form.planta}
              onChange={handleChange}
              className="w-full p-4 border border-blue-400 rounded-lg text-black"
            >
              <option value="">Seleccione una planta</option>
              {plantas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-8 rounded-md shadow-md hover:scale-105 transition duration-300"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
