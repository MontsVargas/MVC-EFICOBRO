export default function ClientesCariñan() {
    return (
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
           <div className="flex justify-between mt-6">
  <div className="flex">
    <button className="bg-[#4ab9d2] text-white px-4 py-2 rounded shadow hover:bg-[#3a99b2]">
      Mostrar Cliente Seleccionado
    </button>
  </div>
  <div className="flex">
    <button className="bg-[#4ab9d2] text-white px-4 py-2 rounded shadow hover:bg-[#3a99b2]">
      Mostrar todos los clientes
    </button>
  </div>
</div>
            </div>
          </main>
    );
}
