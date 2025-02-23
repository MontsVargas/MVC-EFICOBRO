import clientes from "@/mocks/clientes";
type Cliente = {
    nombre: string;
    direccion: string;
    contrato_id?: number;
  };
  export default function Todos (){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Clientes</h1>
        <ul className="mt-4 w-full max-w-md">
          {clientes.map((cliente, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md mb-2">
              <p className="text-lg font-semibold">{cliente.nombre}</p>
              <p className="text-gray-600">Dirección: {cliente.direccion}</p>
              {cliente.contrato_id && <p className="text-gray-500">Contrato ID: {cliente.contrato_id}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  