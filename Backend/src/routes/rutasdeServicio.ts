import { Router, Request, Response } from "express";
import { obtenerClientes, obtenerServicios, obtenerPlantas, obtenerTipoServicio, realizarCompra} from "../controllers/serviciosController"; 

const rutas = Router();

rutas.get("/cliente", (req: Request, res: Response) => {
    obtenerClientes(req, res);
  });
  

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

// Ruta para realizar una compra
rutas.post("/compras", (req: Request, res: Response) => {
    realizarCompra(req, res);
});

export default rutas;
