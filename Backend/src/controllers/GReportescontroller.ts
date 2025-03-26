import { Request, Response } from "express";
import { jsPDF } from "jspdf";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generatePDFByClientName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre } = req.query; // Obtener el nombre desde la URL

        if (!nombre) {
            res.status(400).json({ message: "Nombre del cliente requerido" });
            return; // Salimos de la función para evitar más ejecución 
        }  
        console.log(nombre); 

        // Buscar el cliente por nombre en la base de datos
        const cliente = await prisma.cliente.findFirst({
            where: { nombre: nombre as string }, // Filtrar por nombre
            include: {
                contratos: true,
                convenios: true,
                compras: {
                    include: {
                        servicio: true,
                        planta: true
                    }
                }
            }
        });
        console.log(cliente);

        if (!cliente) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return; // Salimos de la función para evitar más ejecución
        }

        // Crear el documento PDF
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Instituto del Agua del Estado", 60, 10);
        doc.setFontSize(12);
        doc.text(`Reporte del Cliente: ${cliente.nombre}`, 10, 20);

        let startY = 30;
        doc.text(`Dirección: ${cliente.direccion}`, 10, startY);
        doc.text(`Teléfono: ${cliente.telefono}`, 10, startY + 10);
        doc.text(`Deuda actual: $${cliente.deuda}`, 10, startY + 20);

        // Guardar y enviar el PDF
        const filePath = `estado_cuenta_cliente_${cliente.nombre}.pdf`;
        doc.save(filePath);
        res.download(filePath);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
