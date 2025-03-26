import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🔍 Buscar cliente por nombre (con filtro opcional)
const buscarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        const filtros: any = {};
        if (nombre) {
            filtros.nombre = { contains: nombre as string };
        }

        // Realizar la búsqueda en la base de datos
        const clientes = await prisma.cliente.findMany({
            where: filtros,
            select: {
                contrato_id: true,
                nombre: true,
                direccion: true,
            },
        });

        // Si no se encuentran clientes, enviar mensaje
        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: 'No existe este cliente' });
        }

        // Agregar el campo `tieneContrato` basado en `contrato_id`
        const clientesConContrato = clientes.map(cliente => ({
            ...cliente,
            tieneContrato: cliente.contrato_id !== null,
        }));

        return res.status(200).json({ clientes: clientesConContrato });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al buscar los clientes' });
    }
};

// 🔍 Mostrar cliente por ID
const mostrarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Buscar cliente en la base de datos usando el ID
        const cliente = await prisma.cliente.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                nombre: true,
                direccion: true,
                telefono: true,
                nombreDependencia: true,
                id_medidor: true,
                deuda: true,
                contrato_id: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Si no se encuentra, enviar mensaje
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        return res.status(200).json({
            ...cliente,
            tieneContrato: cliente.contrato_id !== null,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al mostrar el cliente' });
    }
};

//Agregar nuevo cliente
const agregarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre, direccion, telefono, nombreDependencia, id_medidor, contrato_id } = req.body;

        // Validar que los campos requeridos están presentes
        if (!nombre || !direccion || !telefono || !id_medidor) {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios para agregar el cliente' });
        }

        // Crear cliente en la base de datos
        const nuevoCliente = await prisma.cliente.create({
            data: {
                nombre,
                direccion,
                telefono,
                nombreDependencia,
                id_medidor,
                deuda: 0,
                contrato_id, // Puede ser `null` o un ID válido
            },
        });

        return res.status(201).json({
            ...nuevoCliente,
            tieneContrato: nuevoCliente.contrato_id !== null,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al agregar el cliente' });
    }
};

export { 
    buscarCliente,
    mostrarCliente,
    agregarCliente,
};
