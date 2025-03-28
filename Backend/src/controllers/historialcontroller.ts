import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const HistorialCompras = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validar que el ID es un número válido
        const clienteId = Number(id);
        if (isNaN(clienteId)) {
            res.status(400).json({ message: "El ID del cliente debe ser un número válido" });
            return;
        }

        // Buscar las compras del cliente en la base de datos
        const historialCompras = await prisma.compra.findMany({
            where: { clienteId },
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

        // Si no hay compras, responder con 404
        if (historialCompras.length === 0) {
            res.status(404).json({ message: "No se encontraron compras para este cliente" });
            return;
        }

        // Responder con éxito
        res.status(200).json(historialCompras);
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ message: "Error al obtener el historial de compras", error });
    }
};
