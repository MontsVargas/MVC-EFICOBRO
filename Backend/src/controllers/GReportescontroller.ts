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
// Reporte General 
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
      doc.setFont("Helvetica", "italic");
      doc.text(`Cliente #${index + 1}: ${cliente.nombre}`, 10, startY);
      doc.text(`Deuda: $${cliente.deuda}`, 10, startY + 10);
      startY += 20;

      if (cliente.compras && cliente.compras.length > 0) {
        cliente.compras.forEach((compra, indexCompra) => {
          const costoServicio = compra.servicio && compra.servicio.costo
            ? parseFloat(compra.servicio.costo.toString())
            : 0;
          const metrosCubicos = compra.cantidadServicio
            ? parseFloat(compra.cantidadServicio.toString())
            : 0;
          const totalCompra = costoServicio * metrosCubicos;
          doc.text(`Compra #${indexCompra + 1}: Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, 10, startY);
          doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"} - Total: $${totalCompra.toFixed(2)}`, 10, startY + 10);
          startY += 20;
        });
      }
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
    // Calcula el inicio y fin de la semana actual.
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
    compras.forEach((compra, index) => {
      if (startY > 270) {
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

      doc.text(`Compra #${index + 1}:`, 10, startY);
      doc.text(`Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, 10, startY + 10);
      doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"}`, 10, startY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, 10, startY + 30);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, 10, startY + 40);
      startY += 50;
    });

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
    compras.forEach((compra, index) => {
      if (startY > 270) {
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

      doc.text(`Compra #${index + 1}:`, 10, startY);
      doc.text(`Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, 10, startY + 10);
      doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"}`, 10, startY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, 10, startY + 30);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, 10, startY + 40);
      startY += 50;
    });

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_mensual.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte mensual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reporte Anual (suma de las compras por mes del año)
export const generateYearlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    // Se puede enviar el año en el query, si no se usa el año actual
    const year = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const compras = await prisma.compra.findMany({
      where: {
        fecha: {
          gte: startOfYear,
          lte: endOfYear
        }
      },
      include: {
        servicio: { include: { Tiposervicio: true } }
      }
    });

    // Inicializamos un objeto para acumular los totales por mes 
    const monthlyTotals: { [key: number]: number } = {};
    for (let i = 0; i < 12; i++) {
      monthlyTotals[i] = 0;
    }

    compras.forEach(compra => {
      const fechaCompra = new Date(compra.fecha);
      const mes = fechaCompra.getMonth(); 
      const costoServicio = compra.servicio && compra.servicio.costo
        ? parseFloat(compra.servicio.costo.toString())
        : 0;
      const metrosCubicos = compra.cantidadServicio
        ? parseFloat(compra.cantidadServicio.toString())
        : 0;
      const totalCompra = costoServicio * metrosCubicos;
      monthlyTotals[mes] += totalCompra;
    });

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Instituto del Agua del Estado", 60, 20);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text(`Reporte Anual - ${year}`, 75, 30);

    let startY = 40;
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    for (let mes = 0; mes < 12; mes++) {
      doc.text(`${monthNames[mes]}: $${monthlyTotals[mes].toFixed(2)}`, 10, startY);
      startY += 10;
    }

    const overallTotal = Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0);
    doc.setFontSize(14);
    doc.text(`Total Anual: $${overallTotal.toFixed(2)}`, 10, startY + 10);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_anual_${year}.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error al generar el reporte anual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
