export default function Clientes() {
    return (
          <main className="flex-grow p-6 bg-white">
            <p className="text-center text-xl font-semibold text-black ">Buscar cliente</p>

           {/* Buttons */}
           <div className="flex flex-col items-center space-y-4">
           <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">INGRESA EL NOMBRE DEL CLIENTE</button>
            <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">MOSTRAR RESULTADOS</button>
            <button className="bg-[#6aa3af] text-white py-2 px-4 rounded hover:bg-[#558c98]">AGREGAR CLIENTE</button>
          </div>
          </main>
    );
  }
  