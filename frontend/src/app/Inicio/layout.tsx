import { ReactNode } from "react";
import Image from 'next/image';
import Link from "next/link";

type Opcion = {
    ruta: string;
    icono: string;
    texto_alterno: string;
    texto: string;
}

const opciones: Opcion[] = [
    { ruta: "/Inicio/Clientes", icono: "/user.svg", texto_alterno: "Clientes Icon", texto: "CLIENTES" },
    { ruta: "/Inicio/Servicios", icono: "/services.svg", texto_alterno: "Servicios Icon", texto: "SERVICIOS" },
    { ruta: "/Inicio/Cuentas", icono: "/dollar.svg", texto_alterno: "Cuentas Icon", texto: "CUENTAS" },
    { ruta: "/Inicio/Clientes-Cari", icono: "/rural.svg", texto_alterno: "Cariñan Icon", texto: "CARIÑAN" },
]

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-1/5 bg-blue-800 text-white flex flex-col" style={{ backgroundImage: 'url("/Imagen1.svg")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'left' }}>

                <div className="text-center text-lg font-bold p-4 border-b border-gray-300">
                    INICIO
                </div>

                <nav className="flex-grow">
                    <ul className="space-y-4 p-4">
                        {opciones.map((opcion, index) => <OpcionDeNavegacion opcion={opcion} key={index} />)}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
                {/* Top Bar */}
                <header className="w-full bg-[#529fe4] text-white p-4 text-lg font-bold shadow-md flex items-center gap-4">
                  
                    EFICOBRO
                </header>

                {children}
            </div>
        </div>
    )
}

function OpcionDeNavegacion({opcion}: {opcion: Opcion}) {
    return (
        <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer">
            <Link href={opcion.ruta} className="flex flex-col items-center justify-center">
                <Image src={opcion.icono} alt={opcion.texto_alterno} width={20} height={20} />{opcion.texto}
            </Link>
        </li>
    )
}
