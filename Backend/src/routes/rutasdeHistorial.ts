import { Router } from "express";
import { HistorialCompras } from "../controllers/historialcontroller"; // Importamos el controlador

const rutas = Router();

// Ruta para obtener el historial de compras de un cliente por ID
rutas.get("/historial/:id", HistorialCompras);

export default rutas;
