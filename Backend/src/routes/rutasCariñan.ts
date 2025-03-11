import { Router } from "express";
import { buscarClientesCariñan } from "../controllers/cariñancontroller";


const rutas = Router();

rutas.get("/clientes/cariñan", buscarClientesCariñan);

export default rutas;