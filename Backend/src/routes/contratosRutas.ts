import { Router, Request, Response } from 'express';
import { verificarContratoCliente } from '../controllers/contratoController';

const rutas = Router();

rutas.get('/:idCliente/contrato', (req: Request, res: Response) => {
  verificarContratoCliente(req, res);
});

export default rutas;
