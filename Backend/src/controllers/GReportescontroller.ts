import { Request, Response } from "express";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Función para generar el PDF
const generarPDF = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "../../reportes/reporte.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    try {
      doc.fontSize(20).text("Reporte Completo", { align: "center" }).moveDown(2);

      // Sección de prueba (puedes modificar según tu BD)
      doc.fontSize(16).text("Ejemplo de Reporte").moveDown();
      doc.fontSize(12).text("- Cliente: Juan Pérez | Deuda: $500");

      doc.end();
      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

//Descargar el PDF
export const descargarPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = await generarPDF();
    res.download(filePath, "reporte.pdf");
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF" });
  }
};

// Mostrar el PDF en el navegador
export const imprimirPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = await generarPDF();
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error al mostrar PDF:", error);
    res.status(500).json({ message: "Error al mostrar el PDF" });
  }
};

// Enviar el PDF por correo
export const enviarPDFCorreo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    const filePath = await generarPDF();

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reporte en PDF",
      text: "Adjunto el reporte en PDF.",
      attachments: [{ filename: "reporte.pdf", path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ message: "Error al enviar el correo" });
  }
};
