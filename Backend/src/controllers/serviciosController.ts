import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
            return; // Agregamos return para evitar que continúe ejecutando código
        }

        res.status(200).json({ servicios });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" }); 
    }
};

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
