import { Router } from "express";
import { buscarClientesCarinan } from "../controllers/cariñancontroller";


const rutas = Router();

rutas.get("/clientes/cariñan", buscarClientesCarinan);

export default rutas;