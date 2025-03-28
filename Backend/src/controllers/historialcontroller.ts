import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Historial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "ID del cliente requerido" });
            return;
        }

        // Buscar las compras del cliente en la base de datos
        const historialCompras = await prisma.compra.findMany({
            where: { clienteId: parseInt(id) },
            include: {
                cliente: true,
                servicio: {
                    include: {
                        Tiposervicio: true // Incluye el tipo de servicio
                    }
                },
                planta: true
            }
        });

        if (historialCompras.length === 0) {
            res.status(404).json({ message: "No se encontraron compras para este cliente" });
            return;
        }

        res.status(200).json({historialCompras});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el historial de compras", error });
    }
};
