import { Request, Response } from "express";
import { jsPDF } from "jspdf";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reporte por Cliente
export const generatePDFByClientName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      res.status(400).json({ message: "Nombre del cliente requerido" });
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
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Instituto del Agua del Estado", 65, 20);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte de Cliente", 85, 25);

    let startY = 30;

    // Datos del cliente e instituto (sin cuadro, solo texto)
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Cliente: ${cliente.nombre}`, 10, startY);
    doc.text(`Dirección: ${cliente.direccion}`, 10, startY + 10);
    doc.text(`Teléfono: ${cliente.telefono}`, 10, startY + 20);
    doc.text(`Deuda: $${cliente.deuda}`, 10, startY + 30);
    startY += 40;

    // Mostrar las compras dentro de cuadros horizontales
    let purchaseStartX = 10;
    let purchaseStartY = startY;

    cliente.compras.forEach((compra, index) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;

      if (purchaseStartX > 160) {
        purchaseStartX = 10;
        purchaseStartY += 50;
      }

      // Cuadro para cada servicio
      doc.setLineWidth(0.5);
      doc.rect(purchaseStartX, purchaseStartY, 45, 40);
      doc.setFontSize(10);
      doc.text(`Servicio: ${compra.servicio.descripcion}`, purchaseStartX + 5, purchaseStartY + 10);
      doc.text(`Planta: ${compra.planta.nombre}`, purchaseStartX + 5, purchaseStartY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 30);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 40);

      purchaseStartX += 50;
    });

    startY = purchaseStartY + 50; // Ajuste de la posición Y para la siguiente sección

    // Total de compras
    let totalGastado = cliente.compras.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;
      return acc + totalCompra;
    }, 0);

    // Cuadro para el total
    doc.setLineWidth(1);
    doc.rect(10, startY, 190, 30);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Total gastado: $${totalGastado.toFixed(2)}`, 75, startY + 15);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="estado_cuenta_cliente_${cliente.nombre}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reporte General de Clientes
export const generateGeneralReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        contratos: true,
        convenios: true,
        compras: {
          include: {
            servicio: { include: { Tiposervicio: true } },
            planta: true
          }
        }
      }
    });

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Instituto del Agua del Estado", 65, 20);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte General de Clientes", 75, 25);

    let startY = 30;

    clientes.forEach((cliente, index) => {
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text(`Cliente #${index + 1}: ${cliente.nombre}`, 10, startY);
      doc.text(`Deuda: $${cliente.deuda}`, 10, startY + 10);
      startY += 20;

      let purchaseStartX = 10;
      let purchaseStartY = startY;

      cliente.compras.forEach((compra, indexCompra) => {
        const costoServicio = parseFloat(compra.servicio.costo.toString());
        const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
        const totalCompra = costoServicio * metrosCubicos;

        if (purchaseStartX > 160) {
          purchaseStartX = 10;
          purchaseStartY += 50;
        }

        // Cuadro para cada compra
        doc.setLineWidth(0.5);
        doc.rect(purchaseStartX, purchaseStartY, 45, 40);
        doc.setFontSize(10);
        doc.text(`Servicio: ${compra.servicio.descripcion}`, purchaseStartX + 5, purchaseStartY + 10);
        doc.text(`Planta: ${compra.planta.nombre}`, purchaseStartX + 5, purchaseStartY + 20);
        doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 30);
        doc.text(`Total: $${totalCompra.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 40);

        purchaseStartX += 50;
      });

      startY = purchaseStartY + 50;
      doc.line(10, startY, 200, startY);
      startY += 10;
    });

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_general.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte general:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reporte Semanal
export const generateWeeklyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const compras = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      },
      include: {
        servicio: { include: { Tiposervicio: true } },
        planta: true
      }
    });

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Reporte Semanal de Compras", 65, 20);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text(`Semana: ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`, 75, 25);

    let startY = 30;
    let purchaseStartX = 10;
    let purchaseStartY = startY;

    compras.forEach((compra, index) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;

      if (purchaseStartX > 160) {
        purchaseStartX = 10;
        purchaseStartY += 50;
      }

      // Cuadro para cada compra
      doc.setLineWidth(0.5);
      doc.rect(purchaseStartX, purchaseStartY, 45, 40);
      doc.setFontSize(10);
      doc.text(`Servicio: ${compra.servicio.descripcion}`, purchaseStartX + 5, purchaseStartY + 10);
      doc.text(`Planta: ${compra.planta.nombre}`, purchaseStartX + 5, purchaseStartY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 30);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 40);

      purchaseStartX += 50;
    });

    // Total semanal
    let totalSemanal = compras.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;
      return acc + totalCompra;
    }, 0);

    // Cuadro para el total semanal
    doc.setLineWidth(1);
    doc.rect(10, purchaseStartY + 10, 190, 30);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Total Semanal: $${totalSemanal.toFixed(2)}`, 75, purchaseStartY + 25);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_semanal.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte semanal:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// Reporte Mensual
export const generateMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    const compras = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        servicio: { include: { Tiposervicio: true } },
        planta: true
      }
    });

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Reporte Mensual de Compras", 65, 20);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    doc.text(`Mes: ${monthName} ${startOfMonth.getFullYear()}`, 75, 25);

    let startY = 30;
    let totalGeneral = 0;
    const marginLeft = 10;
    const boxWidth = 60; // Ancho de cada cuadro
    const boxHeight = 50; // Ajustar la altura para que la información no se corte
    const spaceBetween = 10; // Espacio entre cuadros
    const rowHeight = boxHeight + spaceBetween; // Altura total por fila

    compras.forEach((compra, index) => {
      if (startY > 240) {
        doc.addPage();
        startY = 20;
      }

      const costoServicio = compra.servicio && compra.servicio.costo
        ? parseFloat(compra.servicio.costo.toString())
        : 0;
      const metrosCubicos = compra.cantidadServicio
        ? parseFloat(compra.cantidadServicio.toString())
        : 0;
      const totalCompra = costoServicio * metrosCubicos;

      const row = Math.floor(index / 3); // Fila en la que estamos
      const col = index % 3; // Columna en la que estamos

      // Dibuja el cuadro para la información
      const x = marginLeft + col * (boxWidth + spaceBetween); // Posición X
      const y = startY + row * rowHeight; // Posición Y

      doc.rect(x, y, boxWidth, boxHeight); // Cuadro de la compra
      doc.rect(x, y + boxHeight - 10, boxWidth, 10); // Cuadro para el total

      // Coloca la información dentro del cuadro
      doc.text(`Compra #${index + 1}`, x + 5, y + 10);
      doc.text(`Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, x + 5, y + 20);
      doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"}`, x + 5, y + 30);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, x + 5, y + 40);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, x + 5, y + boxHeight - 5);

      totalGeneral += totalCompra;

      if (col === 2) {
        // Si hemos colocado tres cuadros, pasamos a la siguiente fila
        startY += rowHeight;
      }
    });

    // Total general de todas las compras
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Total: $${totalGeneral.toFixed(2)}`, 130, startY + 10);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="reporte_mensual.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte mensual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
export const generateYearlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const anio = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();

    if (isNaN(anio)) {
      res.status(400).json({ message: "Año inválido" });
      return;
    }

    const startOfYear = new Date(anio, 0, 1); // Primer día del año
    const endOfYear = new Date(anio, 11, 31, 23, 59, 59, 999); // Último día del año

    const compras = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        servicio: true,
        planta: true,
      },
    });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Instituto del Agua del Estado", 60, 20);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text(`Reporte Anual - ${anio}`, 75, 30);

    let startY = 40;
    let totalAnual = 0;

    compras.forEach((compra, index) => {
      const costoServicio = compra.servicio ? parseFloat(compra.servicio.costo.toString()) : 0;
      const metrosCubicos = compra.cantidadServicio ? parseFloat(compra.cantidadServicio.toString()) : 0;
      const totalCompra = costoServicio * metrosCubicos;

      totalAnual += totalCompra;

      doc.setFontSize(10);
      doc.text(`Compra #${index + 1}`, 10, startY);
      doc.text(`Servicio: ${compra.servicio?.descripcion || "N/A"}`, 10, startY + 10);
      doc.text(`Planta: ${compra.planta?.nombre || "N/A"}`, 10, startY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, 10, startY + 30);
      doc.text(`Total Compra: $${totalCompra.toFixed(2)}`, 10, startY + 40);

      startY += 50;

      if (startY > 240) {
        doc.addPage();
        startY = 20;
      }
    });

    // Total anual
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Total Anual: $${totalAnual.toFixed(2)}`, 10, startY);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_anual_${anio}.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte anual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
