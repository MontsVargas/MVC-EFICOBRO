import { Router, Request, Response } from "express";
import { HistorialCompras } from "../controllers/historialcontroller";

const rutas = Router();

//RUTA DE GET PARA OBTENER EL HISTORIAL DE COMPRAS DE CADA CLIENTE
rutas.get("/historial/:id", async (req: Request, res: Response) => {
    const id = decodeURIComponent(req.params.id);
    console.log("ID recibido:", id);
    await HistorialCompras(req, res);
});

export default rutas; 