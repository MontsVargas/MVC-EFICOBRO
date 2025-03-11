import { Router } from "express";
import { obtenerServicios, buscarServiciosPorTipo, obtenerPlantas } from "../controllers/serviciosController"; 

const router = Router();

// Rutas para servicios
router.get("/servicios", obtenerServicios);
router.get("/servicios/tipo", buscarServiciosPorTipo);

// Ruta para obtener plantas de la empresa
router.get("/plantas", obtenerPlantas);

export default router;
