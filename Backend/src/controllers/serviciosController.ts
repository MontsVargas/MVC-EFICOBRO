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
// Realizar una compra
const realizarCompra = async (req: Request, res: Response) => {
    try { 
        const { clienteId, servicioId, cantidadServicio, cobro, direccionCompra, plantaId } = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!clienteId || !servicioId || !cantidadServicio || !cobro || !direccionCompra || !plantaId) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Verificar que el cliente exista
        const cliente = await prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            return res.status(404).json({ mensaje: "El cliente no existe" });
        }

        // Verificar que el servicio exista
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId }
        });
        if (!servicio) {
            return res.status(404).json({ mensaje: "El servicio no existe" });
        }

        // Verificar que la planta exista
        const planta = await prisma.planta.findUnique({
            where: { id: plantaId }
        });
        if (!planta) {
            return res.status(404).json({ mensaje: "La planta no existe" });
        }

        // Crear la compra en la base de datos
        const compra = await prisma.compra.create({
            data: {
                clienteId,
                servicioId,
                fecha: new Date(), // Se registra la fecha actual de la compra
                cantidadServicio,
                cobro,
                direccionCompra,
                plantaId,
            }
        });

        return res.status(201).json({ mensaje: "Compra realizada con éxito", compra });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};
export { obtenerServicios, obtenerPlantas, obtenerTipoServicio, realizarCompra };