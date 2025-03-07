import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buscarClientesCarinan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { nombre } = req.query;

        // Definir filtros con el tipado correcto
        const filtros: Record<string, any> = {
            nombreDependencia: "Cariñan", // Filtrar solo los clientes de Cariñan
        };

        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
                mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
            };
        }

        // Buscar en la base de datos
        const clientes = await prisma.cliente.findMany({
            where: filtros,
            select: {
                contrato_id: true,
                nombre: true,
                direccion: true,
                telefono: true,
                deuda: true,
            },
        });

        if (clientes.length === 0) {
            res.status(404).json({ mensaje: "No hay clientes en Cariñan con ese nombre" });
            return;
        }

        res.status(200).json({ clientes });

    } catch (error) {
        next(error); // Pasamos el error al middleware de manejo de errores
    }
};
export {buscarClientesCariñan}