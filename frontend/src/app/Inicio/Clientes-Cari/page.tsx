export default function ClientesCariñan() {
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
            <p className="text-center text-xl font-semibold mb-6 text-blue-900">Clientes Cariñan</p>
  
            {/* Search Input */}
            <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
              <label className="block text-lg font-medium mb-2 text-black">Buscar por nombre</label>
              <input
                type="text"
                className="w-full p-3 border text-black rounded-md"
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-md shadow-md">
              <label className="block text-lg font-medium mb-2 text-black">Buscar por direccion</label>
              <input
                type="text"
                className="w-full p-3 border text-black rounded-md"
                placeholder="Direccion"
              />
            </div>
  
            {/* Report Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-[#4ab9d2] text-white px-4 py-2 rounded shadow hover:bg-[#3a99b2]">
                Mostrar Clientes
              </button>
            </div>
          </main>
        </div>
      </div>
    );
}
