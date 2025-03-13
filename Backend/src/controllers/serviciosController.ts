
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los servicios que ofrece Inagua
const obtenerServicios = async (req: Request, res: Response) => {
    try {
        const servicios = await prisma.servicio.findMany({
            where: {
                id: { in: [1, 2, 3, 4, 5] }  // Filtra solo los servicios por numero de tipo de servicio
            },
            select: {
                id: true,
                descripcion: true
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
                direccion: true
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

export { obtenerServicios, obtenerPlantas, obtenerTipoServicio };  