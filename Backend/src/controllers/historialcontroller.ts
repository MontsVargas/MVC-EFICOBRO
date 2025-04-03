import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const HistorialCompras = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validar que el ID es un número válido
        const clienteId = Number(id);
        if (isNaN(clienteId)) {
            res.status(400).json({ mensaje: "El ID del cliente debe ser un número válido" });
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
            res.status(404).json({ mensaje: "No se encontraron compras para este cliente" });
            return;
        }

        // Transformar la respuesta a la estructura solicitada
        const historialFormateado = historialCompras.map(compra => ({
            Fecha: compra.fecha, // Asumimos que 'fecha' es el campo de la fecha de la compra
            Servicio: compra.servicio.descripcion, // Usamos 'descripcion' ya que 'nombre' no existe en el servicio
            "Tipo de Servicio": compra.servicio.Tiposervicio.nombre, // Nombre del tipo de servicio
            Planta: compra.planta.nombre // Asumimos que 'nombre' es el nombre de la planta donde se realizó la compra
        }));

        // Responder con éxito
        res.status(200).json({ historialCompras: historialFormateado });
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ mensaje: "Error al obtener el historial de compras", error });
    }
};
