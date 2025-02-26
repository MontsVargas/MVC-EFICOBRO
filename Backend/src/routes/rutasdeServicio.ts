import { Request,Response,Router } from "express";
import { buscarServiciosPorTipo}  from "../controllers/serviciosController";

const rutas = Router();

rutas.get('/servicios',(req: Request, res : Response) =>{
    buscarServiciosPorTipo(req,res);
});

export default rutas; 