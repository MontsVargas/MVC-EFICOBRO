import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buscarClientesCariñan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { nombre } = req.query;

        // Filtros básicos para buscar en la base de datos
        const filtros: Record<string, any> = {
            nombreDependencia: "Cariñan", // Filtrar solo los clientes de Cariñan
        };

        // Si se pasa un nombre, añadirlo al filtro de búsqueda (insensible a mayúsculas/minúsculas)
        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
                mode: "insensitive", // Hace la búsqueda sin distinguir mayúsculas/minúsculas
            };
        }

        // Buscar los clientes en la base de datos
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

        // Si no se encuentran clientes, devolver un mensaje de error
        if (clientes.length === 0) {
            res.status(404).json({ mensaje: "No hay clientes en Cariñan con ese nombre" });
            return;
        }

        // Si se encuentran clientes, devolver la lista
        res.status(200).json({ clientes });

    } catch (error) {
        next(error); // Pasamos el error al middleware de manejo de errores
    }
};


