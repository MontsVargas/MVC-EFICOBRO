import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; 

const prisma = new PrismaClient();

export const verificarContratoCliente = async (req: Request, res: Response) => {
  const idCliente = parseInt(req.params.idCliente);

  if (isNaN(idCliente)) {
    return res.status(400).json({ tieneContrato: false, mensaje: "ID inválido" });
  }

  try {
    
    const cliente = await prisma.cliente.findUnique({
      where: { id: idCliente },
      include: {
        contratos: true, 
      },
    });

    if (!cliente) {
      return res.status(404).json({ tieneContrato: false, mensaje: "Cliente no encontrado" });
    }

    // Si el cliente tiene contratos
    if (cliente.contratos.length > 0) {
      const contrato = cliente.contratos[0]; // Si deseas un solo contrato, tomamos el primero

      return res.json({
        tieneContrato: true,
        mensaje: contrato.id, // Devolver el ID del contrato
        descuento: contrato.descuento,
        fechaCreacion: contrato.createdAt,
        fechaActualizacion: contrato.updatedAt,
      });
    }

    return res.json({ tieneContrato: false, mensaje: "No hay contrato" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ tieneContrato: false, mensaje: "Error del servidor" });
  }
};
