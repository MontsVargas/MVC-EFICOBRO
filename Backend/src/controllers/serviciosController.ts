import { Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient ();

const buscarServicio = async (req: Request, res: Response) => {
    const {id} = req.params;
    const servicio = await prisma.servicio.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    res.json(servicio);
}