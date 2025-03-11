import { Router } from "express";
import { obtenerServicios, buscarServiciosPorTipo, obtenerPlantas } from "../controllers/serviciosController"; 

const rutas = Router();

// Rutas para servicios
rutas.get("/servicios", obtenerServicios);
rutas.get("/servicios/tipo", buscarServiciosPorTipo);

// Ruta para obtener plantas de la empresa
rutas.get("/plantas", obtenerPlantas);

export default rutas;
