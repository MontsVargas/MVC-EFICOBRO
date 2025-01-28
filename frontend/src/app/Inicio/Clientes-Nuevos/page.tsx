export default function ClientesNuevos() {
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
            </ul>
          </nav>
        </aside>
  
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col">
          {/* Top Bar */}
          <header className="w-full bg-[#195c97] text-white 700 p-4 text-lg font-bold shadow-md">
            EFICOBRO
          </header>
  
          {/* Main Content */}
          <main className="flex-grow p-6 bg-white">
            <p className="text-center text-xl font-semibold mb-6">Contenido Principal</p>
  
            {/* Formulario */}
            <div className="max-w-4xl mx-auto p-4">
              <h2 className="text-center text-2xl font-semibold mb-6">Formulario de Información</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 1</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 2</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 3</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 4</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 5</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Campo 6</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ingrese información"
                  />
                </div>
                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#195c97] text-white py-2 px-6 rounded-md hover:bg-[#6aa3af]"
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
  