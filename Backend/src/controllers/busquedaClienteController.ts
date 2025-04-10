import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const busquedaCliente = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.query;

    if (!nombre || typeof nombre !== "string") {
      return res.status(400).json({ mensaje: "Falta el parámetro 'nombre'" });
    }

    const sugerencias = await prisma.cliente.findMany({
      where: {
        nombre: {
          contains: nombre,
        },
      },
      select: {
        nombre: true,
      },
      take: 10,
    });

    const nombres = sugerencias.map((c) => c.nombre);
    return res.status(200).json({ nombres });
  } catch (error) {
    console.error("Error al buscar cliente:", error);
    return res.status(500).json({ mensaje: "Error al buscar el cliente" });
  }
};

// Mostrar un cliente por ID
export const verCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        contrato_id: true,
        // puedes agregar más campos aquí si lo necesitas
      },
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al mostrar cliente:", error);
    return res.status(500).json({ mensaje: "Error al mostrar el cliente" });
  }
};

