import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


//  BUSCAR CLIENTES POR NOMBRE (OPCIONAL)
const buscarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.query;

        const filtros: any = {};
        if (nombre) {
            filtros.nombre = {
                contains: nombre as string,
                mode: "insensitive" // Ignora mayúsculas y minúsculas
            };
        }

        // Buscar clientes en la base de datos
        const clientes = await prisma.cliente.findMany({
            where: filtros,
            select: {
                id: true,
                contrato_id: true,
                nombre: true,
                direccion: true,
                telefono: true,
                nombreDependencia: true,
                id_medidor: true,
                deuda: true,
                createdAt: true,
                updatedAt: true,
                contratos: true // Incluye el contrato si existe
            },
        });

        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: 'No existe este cliente' });
        }

        return res.status(200).json({ clientes });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al buscar los clientes' });
    }
};


//  MOSTRAR CLIENTE POR ID
const mostrarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Buscar el cliente en la base de datos por su ID
        const cliente = await prisma.cliente.findUnique({
            where: { id: Number(id) },
            include: {
                contratos: true,  // Incluye los contratos relacionados si existen
            },
        });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        return res.status(200).json({ cliente });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al mostrar el cliente' });
    }
};


//  AGREGAR CLIENTE (CON O SIN CONTRATO)
const agregarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre, direccion, telefono, nombreDependencia, id_medidor, contrato_id } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!nombre || !direccion || !telefono || !id_medidor) {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios para agregar el cliente' });
        }

        // Validar y asignar contrato_id si es proporcionado
        let contratoAsignado: number | null = null;

        if (contrato_id) {
            const contratoExistente = await prisma.contrato.findUnique({
                where: { id: Number(contrato_id) },
            });

            if (!contratoExistente) {
                return res.status(400).json({ mensaje: 'El contrato especificado no existe' });
            }

            contratoAsignado = Number(contrato_id);
        }

        // Crear el cliente en la base de datos
        const nuevoCliente = await prisma.cliente.create({
            data: {
                nombre,
                direccion,
                telefono,
                nombreDependencia,
                id_medidor,
                contrato_id: contratoAsignado, // Asigna contrato si existe, sino queda null
                deuda: 0, // Inicializa la deuda en 0
            },
        });

        return res.status(201).json({ nuevoCliente });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al agregar el cliente' });
    }
};


// EXPORTAR FUNCIONES
export { 
    buscarCliente,
    mostrarCliente,
    agregarCliente,
};

//tuve que llamar todo lo que tengo en clientes prisma para que me funcionara. 