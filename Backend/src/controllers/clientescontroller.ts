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
// Función para mostrar cliente por ID
const mostrarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Buscar el cliente en la base de datos usando el ID
        const cliente = await prisma.cliente.findUnique({
            where: { id: Number(id) }, // Asegurarse de que el id sea un número
        });

        // Si no se encuentra el cliente, se manda un mensaje
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        return res.status(200).json(cliente); // Si se encuentra, se muestra
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Hubo un error al mostrar el cliente' });
    }
};

const agregarCliente = async (req: Request, res: Response) => {
    try {
        const { nombre, direccion, telefono,} = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!nombre || !direccion || !telefono)  {
            return res.status(400).json({ mensaje: 'Faltan campos necesarios para agregar el cliente' });
        }

        // Crear un nuevo cliente en la base de datos
        const nuevoCliente = await prisma.cliente.create({
            data: {
                nombre,
                direccion,
                telefono,
                nombreDependencia: '', // Agrgar el valor apropiado
                id_medidor: '0', // Agregar el valor apropiado
                deuda: 0, // Agregar el valor apropiado
            },
        });

        return res.status(201).json(nuevoCliente); // Retornar el cliente creado
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
//tuve que llamar todo lo que tengo en clientes prisma para que me funcionara.