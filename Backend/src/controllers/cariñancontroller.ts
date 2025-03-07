import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buscarClientesCariñan = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        const filtros: any = {
            nombreDependencia: "Cariñan", // Filtrar solo los clientes de Cariñan
        };

        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
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
                deuda: true
            },
        });

        // Si no hay clientes, retorna un mensaje
        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: 'No hay clientes en Cariñan con ese nombre' });
        }

        return res.status(200).json({ clientes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al buscar los clientes de Cariñan' });
    }
};
export {buscarClientesCariñan}