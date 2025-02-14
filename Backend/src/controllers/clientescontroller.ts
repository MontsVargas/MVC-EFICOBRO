import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const buscarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        const filtros: any = {};

        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
                mode: 'insensitive' // sirve para hacer la búsqueda insensible a mayúsculas/minúsculas
            };
        }

        // Realizar la búsqueda desde la base de datos
        const clientes = await prisma.cliente.findMany({
            where: filtros,
        });

        // Si no se encontrar clientes te manda este mensajito
        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: 'No existe este cliente' });
        }

        return res.status(200).json(clientes); //si los encuentra los muestra

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al buscar los clientes' });
    }
};

export { buscarCliente };
