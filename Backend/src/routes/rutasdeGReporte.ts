import express from "express";
import { generatePDFByClientName } from "../controllers/GReportescontroller"; // Importamos la nueva función
import { generateGeneralReport } from "../controllers/GReportescontroller";
import { generateMonthlyReport } from "../controllers/GReportescontroller";
import {  generateAnnualReport } from "../controllers/GReportescontroller";

const router = express.Router();

// Ruta para generar un reporte PDF de un cliente por su nombre
router.get("/cliente/nombre", generatePDFByClientName);
router.get("/reportes/generales", generateGeneralReport);
router.get("/reportes/mensuales", generateMonthlyReport);
router.get("/reportes/anuales",  generateAnnualReport);

export default router;
