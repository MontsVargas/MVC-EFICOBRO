export default function Cuentas() {
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
          <main className="flex-grow p-6 bg-white space-y-6 text-blue-900">
            <p className="text-center text-xl font-semibold mb-6 text-blue-900">Selecciona la informacion para generar reporte</p>
  
            {/* Accordion */}
            <div className="space-y-4">
              <details className="border rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">Nombre</summary>
                <div className="p-4">Nombre de la persona seleccionada</div>
              </details>
              <details className="border rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">Servicios</summary>
                <div className="p-4">Servicios contratados por este cliente</div>
              </details>
              <details className="border rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">Fecha de contracion</summary>
                <div className="p-4">Seleccion del dia mes y año en el que se contrato</div>
              </details>
              <details className="border rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">Pagos y/o adeudos</summary>
                <div className="p-4">Muestra el historial de pagos</div>
              </details>
            </div>
  
            {/* Report Button */}
        <div className="flex justify-center">
          <button className="bg-[#4ab9d2] text-white px-4 py-2 rounded shadow hover:bg-[#3a99b2]">
             Mostrar Reportes
            </button>
         </div>

  
            {/* Segmented Button */}
            <div className="flex justify-center space-x-4 mt-8">
              <button className="px-4 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 text-black">
                    Editar
              </button>
              <button className="px-4 py-2 border-t border-b border-gray-300 hover:bg-gray-100 text-black">
                Enviar
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 text-black">
                Imprimir
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  