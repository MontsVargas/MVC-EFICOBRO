import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buscarServiciosPorTipo = async (req: Request, res: Response) => {
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
        })
        if (servicios.length === 0) {
            return res.status(404).json({ mensaje: "NO EXISTEN SERVICIOS" })
        }
        return res.status(200).json({ servicios })

    } catch {
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" })
    }
}

export { buscarServiciosPorTipo };
//post agregar sercios
//get mostrar servicios por cliente
//pach por si se equivocan y quieren cambiarlo 

