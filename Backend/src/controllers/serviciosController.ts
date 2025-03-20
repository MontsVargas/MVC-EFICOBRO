import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los servicios que ofrece Inagua
const obtenerServicios = async (req: Request, res: Response) => {
    try {
        const servicios = await prisma.servicio.findMany({
            select: {
                id: true,
                descripcion: true,
                TipoServicioId: true,
            }
        });

        if (servicios.length === 0) {
            return res.status(404).json({ mensaje: "NO EXISTEN SERVICIOS" });
        }

        return res.status(200).json({ servicios });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};


// Obtener todas las plantas de la empresa
const obtenerPlantas = async (req: Request, res: Response) => {
    try {
        const plantas = await prisma.planta.findMany({
            select: {
                id: true,
                nombre: true,
                direccion: true,
            }
        });

        if (plantas.length === 0) {
            return res.status(404).json({ mensaje: "NO EXISTEN PLANTAS REGISTRADAS" });
        }

        return res.status(200).json({ plantas });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};

// Obtener tipos de servicio
const obtenerTipoServicio = async (req: Request, res: Response) => {
    try {
        const tiposervicio = await prisma.tiposervicio.findMany({
            select: {
                id: true,
                nombre: true,
            }
        });

        if (tiposervicio.length === 0) {
            return res.status(404).json({ mensaje: "NO EXISTEN TIPOS DE SERVICIO REGISTRADOS" });
        }

        return res.status(200).json({ tiposervicio });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};

const realizarCompra = async (req: Request, res: Response) => {
    try {
        console.log("Datos recibidos:", req.body);

        const { nombreCliente, servicioId, cantidadServicio, cobro, direccionCompra, plantaId } = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!nombreCliente || !servicioId || !cantidadServicio || !cobro || !direccionCompra || !plantaId) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Convertir valores numéricos correctamente
        const servicioIdNum = Number(servicioId);
        const cantidadServicioNum = Number(cantidadServicio);
        const cobroNum = Number(cobro);

        if (isNaN(servicioIdNum) || isNaN(cantidadServicioNum) || isNaN(cobroNum)) {
            return res.status(400).json({ mensaje: "Valores numéricos inválidos" });
        }

        // Buscar el cliente por su nombre
        const cliente = await prisma.cliente.findFirst({
            where: { nombre: nombreCliente },
        });

        if (!cliente) {
            return res.status(404).json({ mensaje: "El cliente no existe" });
        }

        // Verificar que la planta exista
        const planta = await prisma.planta.findUnique({
            where: { id: plantaId } // Se mantiene como string
        });

        if (!planta) {
            return res.status(404).json({ mensaje: "La planta no existe" });
        }

        // Crear la compra en la base de datos con el ID del cliente encontrado
        const compra = await prisma.compra.create({
            data: {
                clienteId: cliente.id, // String
                servicioId: servicioIdNum,
                fecha: new Date(),
                cantidadServicio: cantidadServicioNum,
                cobro: cobroNum,
                direccionCompra,
                plantaId, // String
            }
        });

        return res.status(201).json({ mensaje: "Compra realizada con éxito", compra });

    } catch (error: any) {
        console.error("Error en el servidor:", error);

        return res.status(500).json({
            mensaje: "ERROR DEL SERVIDOR",
            error: error.message || error.toString()
        });
    }
};
    
export { obtenerServicios, obtenerPlantas, obtenerTipoServicio, realizarCompra };