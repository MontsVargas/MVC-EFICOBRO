"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {//exportamos el boton de cierre de sesion en el layout
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}usuario/cerrarSesion`, {
        method: "POST",
        credentials: "include", // cookies
      });

      if (res.ok) {
        router.push("/Iniciar-sesion"); // Redirigir al login después de cerrar sesión
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión", error);
    }
  };
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
    >
      Cerrar Sesión
    </button>
  );
}

