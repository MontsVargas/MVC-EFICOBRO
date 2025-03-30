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

        const cliente = await prisma.cliente.findFirst({
            where: { nombre: { equals: nombre as string } },
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

        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Instituto del Agua del Estado", 65, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Reporte de Cliente", 85, 25);
        

        let startY = 30;
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text(`Dirección: ${cliente.direccion}`, 10, startY);
        doc.text(`Teléfono: ${cliente.telefono}`, 10, startY + 10);
        doc.text(`Deuda actual: $${cliente.deuda}`, 10, startY + 20);
        
        startY += 40;
        



        doc.setFontSize(14);
        doc.text("Historial de Compras", 10, startY);
        doc.setFontSize(12);
        startY += 10;

        let totalGastado = 0;

        if (cliente.compras.length > 0) {
            cliente.compras.forEach((compra, index) => {
                if (startY > 270) { 
                    doc.addPage();
                    startY = 20; 
                }

                const costoServicio = parseFloat(compra.servicio.costo.toString());
                const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
                const totalCompra = costoServicio * metrosCubicos;

                doc.text(`Compra #${index + 1}`, 10, startY);
                doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString()}`, 10, startY + 10);
                doc.text(`Servicio: ${compra.servicio.descripcion}`, 10, startY + 20);
                doc.text(`Planta: ${compra.planta.nombre}`, 10, startY + 30);
                doc.text(`Cantidad de servicio: ${metrosCubicos.toFixed(2)}`, 10, startY + 40);
                doc.text(`Costo por unidad: $${costoServicio.toFixed(2)}`, 10, startY + 50);
                doc.text(`Total de la compra: $${totalCompra.toFixed(2)}`, 10, startY + 60);
                doc.line(10, startY + 65, 200, startY + 65);
                startY += 70;

                totalGastado += totalCompra;
            });

            if (startY > 270) {
                doc.addPage();
                startY = 20;
            }

            doc.setFontSize(14);
            doc.text(`Total gastado en compras: $${totalGastado.toFixed(2)}`, 10, startY);
        } else {
            doc.text("No hay compras registradas.", 10, startY);
        }

        const pdfBuffer = doc.output("arraybuffer");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="estado_cuenta_cliente_${cliente.nombre}.pdf"`);
        res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
