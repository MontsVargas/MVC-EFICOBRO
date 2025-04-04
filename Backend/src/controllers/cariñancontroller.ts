import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buscarClientesCarinan = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        // Filtros para clientes de dependencia Cariñan
        const filtros: Record<string, any> = {
            nombreDependencia: "Cariñan",
        };

        // Si hay un nombre en la consulta, agregarlo al filtro
        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
            };
        }

        // Buscar clientes en la base de datos
        const clientes = await prisma.cliente.findMany({
            where: filtros,
            select: {
                contrato_id: true,
                nombre: true,
                direccion: true,
                telefono: true,
             
            },
        });

        // Si no hay clientes, devolver un mensaje de error
        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: "No hay clientes en Cariñan con ese nombre" });
        }

        // Responder con los clientes encontrados
        return res.status(200).json({ clientes });

    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};
export const buscarClientesCarinanPorNombre = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({ mensaje: "Debe proporcionar un nombre para la búsqueda" });
        }

        const clientes = await prisma.cliente.findMany({
            where: {
                nombreDependencia: "Cariñan",
                nombre: {
                    contains: nombre as string,
                },
            },
            select: {
                contrato_id: true,
                nombre: true,
                direccion: true,
                telefono: true,
              
            },
        });

        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: `No hay clientes en Cariñan con el nombre "${nombre}"` });
        }

        return res.status(200).json({ clientes });

    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};
