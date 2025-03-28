import { Router, Request, Response } from "express";
import { Historial } from "../controllers/historialcontroller";

const rutas = Router();

//RUTA DE GET PARA OBTENER EL HISTORIAL DE COMPRAS DE CADA CLIENTE
rutas.get("/historial/:id", (req: Request, res: Response) => {
    Historial(req, res);
});

export default rutas; 