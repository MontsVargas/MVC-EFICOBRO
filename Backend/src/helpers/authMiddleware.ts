import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { PrismaClient } from "@prisma/client"; //para interactuar con la base de datos. ?

// Extender la interfaz Request de Express para incluir la propiedad usuario
declare global {
    namespace Express {
        interface Request {
            usuario?: { id: number; nombre: string };
        }
    }
}

const prisma = new PrismaClient(); // Inicialización de la conexión con la base de datos

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Obtener el token de autenticación desde las cookies
        const token = req.cookies["auth-token"];
        if (!token) {
            res.status(401).json({ mensaje: "Token no proporcionado" });
            return;
        }

        // Verificar que JWT_SECRET esté configurado en las variables de entorno
        const secreto = process.env.JWT_SECRET;
        if (!secreto) {
            res.status(500).json({ mensaje: "JWT_SECRET no está definido" });
            return;
        }

        // Verificar y decodificar el token
        const decodificado = jwt.verify(token, secreto) as JwtPayload;
        if (!decodificado.id) {
            res.status(401).json({ mensaje: "Token inválido" });
            return;
        }

        // Buscar el usuario en la base de datos usando Prisma
        const usuario = await prisma.usuario.findUnique({
            where: { id: decodificado.id },
            select: { id: true, nombre: true }
        });

        // Manejar caso donde el usuario no existe
        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
            return;
        }

        // Guardar usuario en req.usuario para que otras rutas puedan acceder a él
        req.usuario = { id: usuario.id, nombre: usuario.nombre };

        // Pasar al siguiente middleware
        next();
    } catch (error: any) {
        // Manejo de errores específicos para tokens inválidos
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ mensaje: "Token inválido" });
            return;
        }
        
        // Registro del error en consola y respuesta de error interno
        console.error("Error en authMiddleware:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

export default authMiddleware;
