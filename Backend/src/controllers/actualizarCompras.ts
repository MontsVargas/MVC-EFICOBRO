import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const obtenerCompra = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const compra = await prisma.compra.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!compra) {
        return res.status(404).json({ mensaje: "Compra no encontrada" });
      }
  
      return res.status(200).json(compra);
    } catch (error) {
      console.error("Error al obtener la compra:", error);
      return res.status(500).json({ mensaje: "Error del servidor" });
    }
  };

// Lógica para actualizar parcialmente la compra
export const actualizarCompra = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ID de la compra a actualizar
        const { cantidadServicio } = req.body; // Solo la cantidad del servicio a actualizar

        // Verificar si la compra existe
        const compraExistente = await prisma.compra.findUnique({
            where: { id: parseInt(id) },
        });

        if (!compraExistente) {
            return res.status(404).json({ mensaje: "Compra no encontrada" });
        }

        // Realizar la actualización parcial de la compra
        const compraActualizada = await prisma.compra.update({
            where: { id: parseInt(id) },
            data: {
                cantidadServicio,  // Solo se actualiza este campo
                updatedAt: new Date(), // Actualizamos la fecha de actualización
            },
        });

        // Devolver la compra actualizada
        return res.status(200).json(compraActualizada);

    } catch (error) {
        console.error("Error al actualizar la compra:", error);
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};
