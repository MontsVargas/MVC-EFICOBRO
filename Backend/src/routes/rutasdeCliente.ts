import { Request, Response, Router } from "express";
import { buscarCliente, mostrarCliente,agregarCliente } from "../controllers/clientescontroller";
import authMiddleware from "../helpers/authMiddleware";

const rutas= Router();

// Ruta para buscar clientes
rutas.get('/buscar', authMiddleware, (req: Request, res: Response) => {
    buscarCliente(req, res)
});
//preguntar a carlos si debo crear un get en postman 

// Ruta para mostrar un cliente por ID
rutas.get('/clientes/:id', authMiddleware, (req: Request, res: Response) => {
        mostrarCliente(req, res)
    });

// Ruta para agregar un nuevo cliente
rutas.post('/clientes', authMiddleware, (req: Request, res: Response) => {
    agregarCliente(req, res)
});
export default rutas;

