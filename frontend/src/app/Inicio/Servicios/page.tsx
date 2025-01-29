export default function Servicios() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#4ab9d2] text-white flex flex-col">
        <div className="text-center text-lg font-bold p-4 border-b border-gray-300">
          PANEL DE OPCIONES
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4 p-4">
            <li className="hover:bg-[#6a87af] p-2 rounded cursor-pointer">CLIENTES</li>
            <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">SERVICIOS</li>
            <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">CUENTAS</li>
            <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">DEUDAS</li>
            <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">CARIÑAN</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Top Bar */}
        <header className="w-full bg-[#195c97] text-white p-4 text-lg font-bold shadow-md">
          EFICOBRO
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-white">
          <p className="text-center text-xl font-semibold mb-6">Contenido Principal</p>

          {/* Formulario con Bordes y Fondo */}
          <div className="max-w-4xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
            <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">Contratación de Servicio</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Nombre del Cliente</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Servicio a Contratar</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Fecha de Contratación</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Cifra de Servicio</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Costo del Servicio</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Dirección</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Planta</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-400 rounded-md text-black"
                  placeholder="Ingrese información"
                />
              </div>
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
      </div>
    </div>
  );
}
