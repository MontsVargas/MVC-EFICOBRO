export default function Servicios() {
  return (
        <main className="flex-grow p-6 bg-white">
        
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
  );
}
