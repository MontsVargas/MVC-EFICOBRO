import clientes from "@/mocks/clientes";

export default function Todos() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Todos los Clientes</h1>
      
      <div className="w-full max-w-4xl">
        <table className="w-full bg-blue-400 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-200-200">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Contrato ID</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{cliente.nombre}</td>
                <td className="p-3">{cliente.direccion}</td>
                <td className="p-3">{cliente.contrato_id ? cliente.contrato_id : "Sin Contrato"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
