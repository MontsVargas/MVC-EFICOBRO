export default function ContratosS() {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-1/5 bg-[#86BBC7] text-white flex flex-col">
          <div className="text-center text-lg font-bold p-4 border-b border-gray-300">
            Panel de Opciones
            </div>
          <nav className="flex-grow">
            <ul className="space-y-4 p-4">
              <li className="hover:bg-[#6a87af] p-2 rounded cursor-pointer">CLIENTES</li>
              <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">SERVICIOS</li>
              <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">CUENTAS</li>
              <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">DEUDAS</li>
            </ul>
          </nav>
        </aside>
  
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col">
          {/* Top Bar */}
          <header className="w-full bg-[#f0f4f7] text-gray-700 p-4 text-lg font-bold shadow-md">
            Barra Superior
          </header>
  
          {/* Main Content */}
          <main className="flex-grow p-6 bg-white flex flex-col items-center justify-between">
            {/* Button to input client name */}
            <div className="mb-6">
              <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">
                Ingresar Nombre del Cliente
              </button>
            </div>
  
            {/* Bottom Buttons */}
            <div className="flex space-x-4">
              <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">
                Botón 2
              </button>
              <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">
                Botón 3
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }