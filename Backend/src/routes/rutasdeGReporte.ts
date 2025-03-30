import express from "express";
import { generatePDF } from "../controllers/GReportescontroller"; // Importamos la nueva función

const router = express.Router();

// Ruta para generar un reporte PDF de un cliente por su nombre
router.get("/cliente/nombre", generatePDF);

export default router;
