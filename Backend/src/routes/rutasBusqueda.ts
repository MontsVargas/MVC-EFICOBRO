import { Router, Request, Response } from 'express';
import { busquedaCliente } from '../controllers/busquedaClienteController';
import { verCliente } from '../controllers/busquedaClienteController';

const rutas = Router();

rutas.get('/buscar', (req: Request, res: Response) => {
    busquedaCliente(req, res);
});


rutas.get('/ver/:id', (req: Request, res: Response) => {
    verCliente(req, res);
});

export default rutas;
