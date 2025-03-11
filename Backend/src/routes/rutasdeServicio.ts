import { Router, Request, Response } from "express";
import { obtenerServicios, obtenerPlantas, obtenerTipoServicio } from "../controllers/serviciosController"; 

const rutas = Router();

// Rutas para servicios
rutas.get("/servicios", (req: Request, res: Response) => {
    obtenerServicios(req, res);
});

rutas.get("/servicios/tipo", (req: Request, res: Response) => {
    obtenerTipoServicio(req, res);
});

// Ruta para obtener plantas
rutas.get("/plantas", (req: Request, res: Response) => {
    obtenerPlantas(req, res);
});

export default rutas;
 