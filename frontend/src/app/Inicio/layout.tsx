import { ReactNode } from "react";
import Image from 'next/image';

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
                        <li className="hover:bg-[#6a87af] p-2 rounded cursor-pointer flex items-center gap-2 text-center">
                            <Image src="/user.svg" alt="Clientes Icon" width={20} height={20} />CLIENTES
                        </li>
                        <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer flex items-center gap-2 text-center">
                            <Image src="/services.svg" alt="Servicios Icon" width={20} height={20} />SERVICIOS
                        </li>
                        <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer flex items-center gap-2 text-center">
                            <Image src="/dollar.svg" alt="Cuentas Icon" width={20} height={20}/>CUENTAS
                        </li>
                        <li className="hover:bg-[#6aa3af] p-2 rounded cursor-pointer flex items-center gap-2 text-center">
                            <Image src="/rural.svg" alt="Cariñan Icon" width={20} height={20} />CARIÑAN
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
                {/* Top Bar */}
                <header className="w-full bg-[#529fe4] text-white p-4 text-lg font-bold shadow-md flex items-center gap-4">
                    <Image src="/inagua.svg" alt="inagua Icon" width={20} height={20} className="w-auto h-auto"/>
                    EFICOBRO
                </header>

                {children}
            </div>
        </div>
    )
}

export function Page() {}
