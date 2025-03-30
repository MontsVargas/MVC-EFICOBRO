import { Request, Response } from "express";
import { jsPDF } from "jspdf";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generatePDF = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            res.status(400).json({ mensaje: "Nombre del cliente requerido" });
            return;
        }

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

        if (!cliente) {
            res.status(404).json({ mensaje: "Cliente no encontrado" });
            return;
        }

        // Obtener fecha de contratación
        const fechaContratacion = cliente.contratos.length > 0
            ? new Date(cliente.contratos[0].createdAt).toLocaleDateString()
            : "No disponible";

        // Obtener historial de pagos desde Convenios pagados
        const historialPagos = cliente.convenios
            .filter(convenio => convenio.pagado)
            .map(convenio => ({
                fecha: new Date(convenio.updatedAt).toLocaleDateString(),
                monto: convenio.descuento.toFixed(2)
            }));

        // Generar PDF
        const doc = new jsPDF();
        let startY = 30;

        // Encabezado
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Instituto del Agua del Estado", 65, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Reporte de Cliente", 85, 25);

        // Información del cliente
        doc.setFontSize(12);
        doc.text(`Nombre: ${cliente.nombre}`, 10, startY);
        doc.text(`Dirección: ${cliente.direccion}`, 10, startY + 10);
        doc.text(`Teléfono: ${cliente.telefono}`, 10, startY + 20);
        doc.text(`Deuda actual: $${cliente.deuda.toFixed(2)}`, 10, startY + 30);
        startY += 40;

        // Fecha de contratación
        doc.setFontSize(14);
        doc.text("Fecha de Contratación", 10, startY);
        doc.setFontSize(12);
        doc.text(`Fecha: ${fechaContratacion}`, 10, startY + 10);
        startY += 20;

        // Historial de compras
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

                const totalCompra = parseFloat(compra.servicio.costo.toString()) * compra.cantidadServicio;
                doc.text(`Compra #${index + 1}`, 10, startY);
                doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString()}`, 10, startY + 10);
                doc.text(`Servicio: ${compra.servicio.descripcion}`, 10, startY + 20);
                doc.text(`Planta: ${compra.planta.nombre}`, 10, startY + 30);
                doc.text(`Cantidad: ${compra.cantidadServicio}`, 10, startY + 40);
                doc.text(`Costo por unidad: $${parseFloat(compra.servicio.costo.toString()).toFixed(2)}`, 10, startY + 50);
                doc.text(`Total compra: $${totalCompra.toFixed(2)}`, 10, startY + 60);
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
            startY += 20;
        } else {
            doc.text("No hay compras registradas.", 10, startY);
            startY += 20;
        }

        // Historial de pagos
        doc.setFontSize(14);
        doc.text("Historial de Pagos", 10, startY);
        doc.setFontSize(12);
        startY += 10;

        if (historialPagos.length > 0) {
            historialPagos.forEach((pago, index) => {
                if (startY > 270) {
                    doc.addPage();
                    startY = 20;
                }
                doc.text(`Pago #${index + 1}`, 10, startY);
                doc.text(`Fecha: ${pago.fecha}`, 10, startY + 10);
                doc.text(`Monto: $${pago.monto}`, 10, startY + 20);
                doc.line(10, startY + 25, 200, startY + 25);
                startY += 30;
            });
        } else {
            doc.text("No hay pagos registrados.", 10, startY);
        }

        // Generar PDF y enviar al frontend
        const pdfBuffer = doc.output("arraybuffer");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="estado_cuenta_cliente_${cliente.nombre}.pdf"`);
        res.send(Buffer.from(pdfBuffer));

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
