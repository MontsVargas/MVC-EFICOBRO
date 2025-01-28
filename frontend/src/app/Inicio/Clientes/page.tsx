export default function Clientes() {
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
          <header className="w-full bg-[#195c97] text-white 700 p-4 text-lg font-bold shadow-md">
            EFICOBRO
          </header>
  
          {/* Main Content */}
          <main className="flex-grow p-6 bg-white">
            <p className="text-center text-xl font-semibold text-black ">Buscar cliente</p>
            
           {/* Buttons */}
           <div className="flex flex-col items-center space-y-4">
           <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">INGRESA EL NOMBRE DEL CLIENTE</button>
            <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">MOSTRAR RESULTADOS</button>
            <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">AGREGAR CLIENTE</button>
          </div>
          </main>
        </div>
      </div>
    );
  }
  