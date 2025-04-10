import { Request, Response } from "express";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para obtener el nombre del mes en español
const nombreMes = (mesNumero: number): string => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return meses[mesNumero - 1] || "";
};

export const generatePDFByClientName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, mes, anio } = req.query;

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

    let comprasFiltradas = cliente.compras;

    const mesNumero = mes ? parseInt(mes as string) : null;
    const anioNumero = anio ? parseInt(anio as string) : null;

    if (mesNumero && (mesNumero < 1 || mesNumero > 12)) {
      res.status(400).json({ message: "Mes inválido. Debe estar entre 1 y 12." });
      return;
    }

    if (mesNumero || anioNumero) {
      comprasFiltradas = cliente.compras.filter((compra) => {
        const fecha = new Date(compra.fecha as Date);
        const coincideMes = mesNumero ? (fecha.getMonth() + 1 === mesNumero) : true;
        const coincideAnio = anioNumero ? (fecha.getFullYear() === anioNumero) : true;
        return coincideMes && coincideAnio;
      });
    }

    const doc = new jsPDF();
    doc.setFillColor(173, 216, 230);
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("INSTITUTO DEL AGUA DEL ESTADO", 55, 10);

    doc.setFontSize(14);
    doc.setFont("Helvetica", "italic");
    let subtitulo = "Reporte del cliente";
    if (mesNumero || anioNumero) {
      const mesNombre = mesNumero ? nombreMes(mesNumero) : "";
      const añoTexto = anioNumero ? anioNumero.toString() : "";
      subtitulo += ` (${[mesNombre, añoTexto].filter(Boolean).join(" ")})`;
    }
    const textWidth = doc.getTextWidth(subtitulo);
    doc.text(subtitulo, (210 - textWidth) / 2, 16); // Centrado

    let startY = 30;

    // Cuadro del cliente
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    const cuadroX = 10;
    const cuadroY = startY - 5;
    const cuadroAncho = 80;
    const cuadroAlto = 20;

    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 250);
    doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto, "FD");
    doc.text(`Cliente: ${cliente.nombre}`, 11, startY + 1);
    doc.text(`Dirección: ${cliente.direccion}`, 11, startY + 6);
    doc.text(`Teléfono: ${cliente.telefono}`, 11, startY + 11);

    startY += 40;

    if (comprasFiltradas.length > 0) {
      const rows = comprasFiltradas.map((compra) => {
        const costoServicio = parseFloat(compra.servicio.costo.toString());
        const cantidadServicio = Math.round(parseFloat(compra.cantidadServicio.toString()));
        const totalCompra = costoServicio * cantidadServicio;
        const fecha = new Date(compra.fecha as Date).toLocaleDateString("es-MX");

        return [
          fecha,
          compra.servicio.descripcion,
          compra.planta.nombre,
          cantidadServicio.toString(),
          totalCompra.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
        ];
      });

      autoTable(doc, {
        startY: startY,
        head: [["Fecha", "Servicio", "Planta", "Cantidad", "Total"]],
        body: rows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      startY = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text("No hay compras registradas para este mes/año.", 10, startY);
      startY += 10;
    }

    // Total
    const totalGastado = comprasFiltradas.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const cantidadServicio = Math.round(parseFloat(compra.cantidadServicio.toString()));
      return acc + (costoServicio * cantidadServicio);
    }, 0);

    doc.setLineWidth(1);
    doc.rect(60, startY, 90, 20);
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text(
      `Total gastado: ${totalGastado.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
      105,
      startY + 13,
      { align: "center" }
    );

    // Pie de página con fecha
    const fechaGeneracion = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Reporte generado el ${fechaGeneracion}`, 10, 290);

    // Nombre dinámico del archivo
    const nombreArchivo = [
      `estado_cuenta_cliente_${cliente.nombre}`,
      mesNumero ? nombreMes(mesNumero) : "",
      anioNumero ? anioNumero.toString() : ""
    ]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}.pdf"`);
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
        compras: {
          include: {
            servicio: true,
            planta: true
          }
        }
      }
    });

    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);

    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("INSTITUTO DEL AGUA DEL ESTADO", 55, 10);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte general de clientes", 70, 16);

    let startY = 30;
    let totalGeneral = 0;
    const body: any[] = [];

    clientes.forEach((cliente) => {
      let totalCliente = 0;
      cliente.compras.forEach((compra) => {
        const costo = parseFloat(compra.servicio.costo.toString());
        const cantidad = parseFloat(compra.cantidadServicio.toString());
        const total = costo * cantidad;
        totalCliente += total;
        totalGeneral += total;
        body.push([
          cliente.nombre,
          compra.servicio.descripcion,
          compra.planta.nombre,
          cantidad.toString(),
          total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
        ]);
      });
    });

    autoTable(doc, {
      startY,
      head: [["Cliente", "Servicio", "Planta", "Cantidad", "Total"]],
      body,
      styles: { font: "Helvetica", fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.setFontSize(16);
    doc.rect(60, startY, 90, 20);
    doc.text(
      `Total general: ${totalGeneral.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
      105,
      startY + 13,
      { align: "center" }
    );

    const fechaGeneracion = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Reporte generado el ${fechaGeneracion}`, 10, 290);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_general.pdf"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// Reporte Mensual de Clientes
export const generateMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const monthParam = parseInt(req.query.mes as string);
    const yearParam = parseInt(req.query.anio as string);

    const today = new Date();
    const year = !isNaN(yearParam) ? yearParam : today.getFullYear();
    const month = !isNaN(monthParam) ? monthParam - 1 : today.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

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

    // Encabezado
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.text("INSTITUTO DE AGUA DEL ESTADO", 60, 10);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte Mensual", 80, 15);

    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    doc.text(`Mes: ${monthName} ${year}`, 75, 25);

    // Tabla
    let startY = 40;
    const tableWidth = 190;
    const columnWidths = [50, 60, 40, 40]; // Columnas: Descripción, Planta, Cantidad, Total
    const headers = ["Descripción", "Planta", "Cantidad", "Total"];

    // Encabezado de tabla
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 0, 139); // Azul oscuro
    doc.rect(10, startY, tableWidth, 10, "F");
    headers.forEach((header, index) => {
      doc.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, startY + 7);
    });

    startY += 10;
    let totalGeneral = 0;

    // Contenido de la tabla
    compras.forEach((compra, index) => {
      if (startY > 270) {
        doc.addPage();
        startY = 20;
        doc.setFontSize(10);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 0, 139); // Azul oscuro
        doc.rect(10, startY, tableWidth, 10, "F");
        headers.forEach((header, index) => {
          doc.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, startY + 7);
        });
        startY += 10;
      }

      const costoServicio = compra.servicio?.costo ? parseFloat(compra.servicio.costo.toString()) : 0;
      const metrosCubicos = compra.cantidadServicio ? parseFloat(compra.cantidadServicio.toString()) : 0;
      const totalCompra = costoServicio * metrosCubicos;

      // Colores de las filas alternadas
      const fillColor = index % 2 === 0 ? [255, 255, 255] : [240, 240, 240];
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(10, startY, tableWidth, 10, "F");

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Texto negro
      doc.text(compra.servicio ? compra.servicio.descripcion : "N/A", 15, startY + 6);
      doc.text(compra.planta ? compra.planta.nombre : "N/A", 75, startY + 6);
      doc.text(`${Math.floor(metrosCubicos)} m³`, 135, startY + 6);

      const totalFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalCompra);
      doc.setTextColor(255, 0, 0); // Rojo para el total
      doc.text(totalFormatted, 170, startY + 6);

      startY += 10;
      totalGeneral += totalCompra;
    });

    // Total general
    const totalGeneralFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalGeneral);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Rojo para el total
    doc.text(`Total General: ${totalGeneralFormatted}`, 130, startY);

    // Pie de página con fecha
    const fechaGeneracion = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Reporte generado el ${fechaGeneracion}`, 10, 290);

    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_mensual_${month + 1}_${year}.pdf"`);
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
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.text("INSTITUTO DE AGUA DEL ESTADO", 60, 20);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text(`Reporte Anual - ${anio}`, 80, 25);

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
    doc.setFontSize(16);
    doc.setFont("Helvetica","bold");
    doc.setTextColor(255, 0, 0); // Rojo para el texto
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
