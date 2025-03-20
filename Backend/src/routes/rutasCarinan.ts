import { Router, Request, Response } from "express";
import { buscarClientesCarinan } from "../controllers/cariñancontroller";

const rutas = Router();

rutas.get("/clientes/carinan", (req: Request, res: Response) => {
    buscarClientesCarinan(req, res);
});

export default rutas;