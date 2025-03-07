import { Router } from "express";
import { buscarServiciosPorTipo, obtenerServicios}  from "../controllers/serviciosController";

const rutas = Router();

// Ruta para obtener todos los servicios
rutas.get("/servicios", obtenerServicios);

// Ruta para obtener servicios con su tipo
rutas.get("/servicios/tipo", buscarServiciosPorTipo);

export default rutas;
