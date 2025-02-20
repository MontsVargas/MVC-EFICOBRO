import { Request, Response, Router } from "express";
import { registro, iniciarSesion, cerrarSesion } from "../controllers/usuariosController";
import authMiddleware from "../helpers/authMiddleware";

const rutas= Router();

rutas.post('/registro',authMiddleware, (req: Request, res: Response) => {
    registro(req, res);
});

rutas.post('/iniciarSesion', (req: Request, res: Response) => {
    iniciarSesion(req, res);
});

rutas.post('/cerrarSesion', authMiddleware, (req: Request, res: Response) => {
    cerrarSesion(req, res);
});

export default rutas;