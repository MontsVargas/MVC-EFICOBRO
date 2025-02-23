import { Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient ();

const buscarServiciosPorTipo = async (req: Request, res: Response) => {
    const { nombredelTiposervicio } = req.params;  // Obtener el parámetro 'nombreTipo' de la URL
    
    const servicios = await prisma.servicio.findMany({
        where: {
            TipoServicio: {
                nombre: nombredelTiposervicio  // Filtrar servicio donde TipoServicio tenga ese nombre
            }
        },
        include: {
            TipoServicio: true  // Agregar la información del tipo de servicio en la respuesta
        }
    });

    if (servicios.length > 0) {
        res.json(servicios);  // Devolver los servicios encontrados en formato JSON puedo hacerlo diferente pero temdria que cambiar cosas en el schema de prisma.
    } else {
        res.status(404).json({ mensaje: 'No se encontraron servicios para ese tipo de servicio' });
    }
};

export { buscarServiciosPorTipo };