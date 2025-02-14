import { Request, Response, Router } from "express";
import { buscarCliente } from "../controllers/clientescontroller";
import authMiddleware from "../helpers/authMiddleware";

const rutas= Router();

// Ruta para buscar clientes
rutas.get('/buscar', authMiddleware, (req: Request, res: Response) => {
    buscarCliente(req, res)
});
//preguntar a carlos si debo crear un get en postman 

export default rutas;
