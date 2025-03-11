import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener servicios
export const obtenerServicios: RequestHandler = async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany({
            select: {
                id: true,
                descripcion: true
            }
        });

        if (servicios.length === 0) {
            res.status(404).json({ mensaje: "NO EXISTEN SERVICIOS" });
            return;
        }

        res.status(200).json({ servicios });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};

// Buscar servicios por tipo
export const buscarServiciosPorTipo: RequestHandler = async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany({
            select: {
                id: true,
                descripcion: true,
                TipoServicio: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

        if (servicios.length === 0) {
            res.status(404).json({ mensaje: "NO EXISTEN SERVICIOS" });
            return;
        }

        res.status(200).json({ servicios });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};

// Obtener plantas de la empresa
export const obtenerPlantas: RequestHandler = async (req, res) => {
    try {
        const plantas = await prisma.planta.findMany({
            select: {
                id: true,
                nombre: true,
                direccion: true
            }
        });

        if (plantas.length === 0) {
            res.status(404).json({ mensaje: "NO EXISTEN PLANTAS REGISTRADAS" });
            return;
        }

        res.status(200).json({ plantas });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};
