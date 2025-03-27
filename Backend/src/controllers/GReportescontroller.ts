import { Request, Response } from "express";
import { jsPDF } from "jspdf";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generatePDFByClientName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            res.status(400).json({ message: "Nombre del cliente requerido" });
            return;
        }  

        console.log(nombre); 

        // Buscar el cliente por nombre en la base de datos
        const cliente = await prisma.cliente.findFirst({
            where: { nombre: nombre as string },
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
            return;
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
        
        startY += 40; // Espacio antes del historial de compras

        doc.setFontSize(14);
        doc.text("Historial de Compras", 10, startY);
        doc.setFontSize(12);
        startY += 10;

        let totalCompras = 0; // Variable para sumar el total

        if (cliente.compras.length > 0) {
            cliente.compras.forEach((compra, index) => {
                if (startY > 270) { // Salto de página si se llena la hoja
                    doc.addPage();
                    startY = 20;
                }

                doc.text(`Compra #${index + 1}`, 10, startY);
                doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString()}`, 10, startY + 10);
                doc.text(`Servicio: ${compra.servicio.descripcion}`, 10, startY + 20);
                doc.text(`Planta: ${compra.planta.nombre}`, 10, startY + 30);
                doc.text(`Monto: $${compra.servicio.costo.toFixed(2)}`, 10, startY + 40);
                doc.line(10, startY + 45, 200, startY + 45); // Línea separadora
                startY += 50;

                totalCompras += Number(compra.servicio.costo); // Convertir Decimal a número antes de sumar
            });

            // Mostrar el total al final del historial
            if (startY > 270) {
                doc.addPage();
                startY = 20;
            }

            doc.setFontSize(14);
            doc.text(`Total gastado en compras: $${totalCompras.toFixed(2)}`, 10, startY);
        } else {
            doc.text("No hay compras registradas.", 10, startY);
        }

        // Guardar y enviar el PDF
        const filePath = `estado_cuenta_cliente_${cliente.nombre}.pdf`;
        doc.save(filePath);
        res.download(filePath);
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
