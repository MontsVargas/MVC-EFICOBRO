export default function IniciarSesion() {
    return (
            <div className="flex justify-center items-center min-h-screen bg-[#86BBC7]">
                <div className="p-8 rounded-lg w-96 border border-white">
                    <h2 className="text-2xl font-semibold text-center mb-6">BIENVENIDO</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">USUARIO</label>
                            <input 
                                id="email" 
                                type="email" // text en caso de la eleccion del usuario
                                className="mt-1 block w-full px-4 py-2 border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Correo electrónico"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium">CONTRASEÑA</label>
                            <input 
                                id="password" 
                                type="password" 
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Contraseña"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
    );
}
