import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Compra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const compra = await prisma.compra.findUnique({
      where: { id: parseInt(id) },
      include: {
        servicio: {
          include: {
            Tiposervicio: true,  // Incluye el tipo de servicio relacionado
          },
        },
      },
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

export const Servicios = async (req: Request, res: Response) => {
  try {
    const servicios = await prisma.servicio.findMany({
      select: {
        id: true,
        descripcion: true,
        TipoServicioId: true,
      },
    });

    if (servicios.length === 0) {
      return res.status(404).json({ mensaje: "NO EXISTEN SERVICIOS" });
    }

    return res.status(200).json({ servicios });
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
  }
};

export const Plantas = async (req: Request, res: Response) => {
  try {
    const plantas = await prisma.planta.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
      },
    });

    if (plantas.length === 0) {
      return res.status(404).json({ mensaje: "NO EXISTEN PLANTAS REGISTRADAS" });
    }

    return res.status(200).json({ plantas });
  } catch (error) {
    console.error("Error al obtener las plantas:", error);
    return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
  }
};

export const TiposServicio = async (req: Request, res: Response) => {
  try {
    const tiposServicio = await prisma.tiposervicio.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    if (tiposServicio.length === 0) {
      return res.status(404).json({ mensaje: "NO EXISTEN TIPOS DE SERVICIO REGISTRADOS" });
    }

    return res.status(200).json({ tiposServicio });
  } catch (error) {
    console.error("Error al obtener los tipos de servicio:", error);
    return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
  }
};
// Actualizar una compra
export const actualizarCompra = async (req: Request, res: Response) => {
  const { cantidadServicio, servicioId, plantaId, direccionCompra } = req.body;
  
  try {
    const compra = await prisma.compra.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        cantidadServicio,
        servicio: { connect: { id: servicioId } },
        planta: { connect: { id: plantaId } },
        direccionCompra,
      },
    });
    res.json(compra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la compra" });
  }
};