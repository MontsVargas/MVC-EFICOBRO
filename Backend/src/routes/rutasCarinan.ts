import { Router, Request, Response } from "express";
import { buscarClientesCarinan, buscarClientesCarinanPorNombre } from "../controllers/cariñancontroller";

const rutas = Router();

// Ruta para obtener todos los clientes de la dependencia "Cariñan"
rutas.get("/clientes/carinan", (req: Request, res: Response) => {
    buscarClientesCarinan(req, res);
});

// Nueva ruta para buscar clientes en "Cariñan" filtrando por nombre
rutas.get("/clientes/carinan/buscar", (req: Request, res: Response) => {
    buscarClientesCarinanPorNombre(req, res);
});

export default rutas;