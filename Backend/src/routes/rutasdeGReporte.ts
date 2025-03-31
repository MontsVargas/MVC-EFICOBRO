import express from "express";
import { generatePDFByClientName } from "../controllers/GReportescontroller"; // Importamos la nueva función
import { generateGeneralReport } from "../controllers/GReportescontroller";
import { generateWeeklyReport } from "../controllers/GReportescontroller";
import { generateMonthlyReport } from "../controllers/GReportescontroller";
import { generateYearlyReport } from "../controllers/GReportescontroller";
const router = express.Router();


router.get("/cliente/nombre", generatePDFByClientName);// Ruta para generar un reporte PDF de un cliente por su nombre
router.get("/reportes/generales", generateGeneralReport);//Reporte general
router.get("/reportes/semanales", generateWeeklyReport); //Reporte por semana
router.get("/reportes/mensuales", generateMonthlyReport); //Reporte por mes
router.get("/reportes/anuales", generateYearlyReport);//Reporte por año


export default router;
