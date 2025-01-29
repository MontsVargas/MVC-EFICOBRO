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
        <main className="flex-grow p-6 bg-white text-blue-900">
          <p className="text-center text-xl font-semibold mb-6">
            Selecciona la información para generar el reporte
          </p>

          {/* Sección de Reportes con Fondo y Bordes */}
          <div className="max-w-3xl mx-auto p-6 bg-[#f0f8fb] border border-gray-300 shadow-lg rounded-lg">
            <h2 className="text-center text-2xl font-semibold mb-6 text-[#195c97]">
              Generación de Reportes
            </h2>

            {/* Accordion */}
            <div className="space-y-4">
              <details className="border border-gray-300 rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">
                  Nombre
                </summary>
                <div className="p-4">Nombre de la persona seleccionada</div>
              </details>
              <details className="border border-gray-300 rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">
                  Servicios
                </summary>
                <div className="p-4">Servicios contratados por este cliente</div>
              </details>
              <details className="border border-gray-300 rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">
                  Fecha de contratación
                </summary>
                <div className="p-4">Selecciona el día, mes y año en el que se contrató</div>
              </details>
              <details className="border border-gray-300 rounded-lg text-left text-black">
                <summary className="cursor-pointer p-4 bg-gray-100 font-semibold text-black">
                  Pagos y/o adeudos
                </summary>
                <div className="p-4">Muestra el historial de pagos</div>
              </details>
            </div>

            {/* Botón de Reportes */}
            <div className="flex justify-center mt-6">
              <button className="bg-[#4ab9d2] text-white px-4 py-2 rounded shadow hover:bg-[#3a99b2] transition">
                Mostrar Reportes
              </button>
            </div>

            {/* Botones de Acción */}
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
          </div>
        </main>
      </div>
    </div>
  );
}
