import clientes from "@/mocks/clientes";

export default function Todos() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Todos los Clientes</h1>
      
      <div className="w-full max-w-4xl">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border border-blue-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Dirección</th>
              <th className="p-4 text-left">Contrato ID</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr key={index} className="border-b border-blue-200 hover:bg-blue-100 transition">
                <td className="p-4 text-blue-900">{cliente.nombre}</td>
                <td className="p-4 text-blue-900">{cliente.direccion}</td>
                <td className="p-4 text-blue-900">{cliente.contrato_id ? cliente.contrato_id : "Sin Contrato"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
