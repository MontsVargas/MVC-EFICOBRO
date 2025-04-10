import { Request, Response } from "express";
import { jsPDF } from "jspdf";
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

    // Filtrar por mes y año si se proporcionan
    if (mesNumero || anioNumero) {
      comprasFiltradas = cliente.compras.filter((compra) => {
        const fecha = new Date(compra.fecha as Date);
        const coincideMes = mesNumero ? (fecha.getMonth() + 1 === mesNumero) : true;
        const coincideAnio = anioNumero ? (fecha.getFullYear() === anioNumero) : true;
        return coincideMes && coincideAnio;
      });
    }

    // Crear el PDF
    const doc = new jsPDF();
    doc.setFillColor(173, 216, 230);
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("INSTITUTO DEL AGUA DEL ESTADO", 55, 10);

    // Subtítulo dinámico
    doc.setFontSize(14);
    doc.setFont("Helvetica", "italic");
    let subtitulo = "Reporte del cliente";
    if (mesNumero || anioNumero) {
      const mesNombre = mesNumero ? nombreMes(mesNumero) : "";
      const añoTexto = anioNumero ? anioNumero.toString() : "";
      subtitulo += ` (${[mesNombre, añoTexto].filter(Boolean).join(" ")})`;
    }
    doc.text(subtitulo, 85, 16);

    let startY = 30;

    // Cuadro de información del cliente
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");

    const cuadroX = 10;
    const cuadroY = startY - 5;
    const cuadroAncho = 80;
    const cuadroAlto = 20;

    doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto);
    doc.setDrawColor(0);
    doc.setFillColor(230, 230, 250);
    doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto, "FD");
    doc.text(`Cliente: ${cliente.nombre}`, 11, startY + 1);
    doc.text(`Dirección: ${cliente.direccion}`, 11, startY + 6);
    doc.text(`Teléfono: ${cliente.telefono}`, 11, startY + 10);

    startY += 40;
    let purchaseStartY = startY;

    if (comprasFiltradas.length === 0) {
      doc.setFontSize(10);
      doc.text("No hay compras registradas para este mes/año.", 10, purchaseStartY);
      purchaseStartY += 10;
    } else {
      comprasFiltradas.forEach((compra) => {
        const costoServicio = parseFloat(compra.servicio.costo.toString());
        const cantidadServicio = Math.round(parseFloat(compra.cantidadServicio.toString()));
        const totalCompra = costoServicio * cantidadServicio;

        const fecha = new Date(compra.fecha as Date);
        const fechaFormateada = fecha.toLocaleDateString("es-MX");

        doc.setFontSize(10);
        doc.text(`Fecha: ${fechaFormateada}`, 10, purchaseStartY);
        doc.text(`Servicio: ${compra.servicio.descripcion}`, 10, purchaseStartY + 10);
        doc.text(`Planta: ${compra.planta.nombre}`, 10, purchaseStartY + 20);
        doc.text(`Cantidad: ${cantidadServicio}`, 10, purchaseStartY + 30);
        doc.text(`Total: ${totalCompra.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`, 10, purchaseStartY + 40);

        purchaseStartY += 50;
      });
    }

    // Total gastado
    const totalGastado = comprasFiltradas.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const cantidadServicio = Math.round(parseFloat(compra.cantidadServicio.toString()));
      return acc + (costoServicio * cantidadServicio);
    }, 0);

    doc.setLineWidth(1);
    doc.rect(60, purchaseStartY, 90, 20);
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text(
      `Total gastado: ${totalGastado.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}`,
      105,
      purchaseStartY + 13,
      { align: "center" }
    );

    const pdfBuffer = doc.output("arraybuffer");

    // Nombre del archivo dinámico
    const nombreArchivo = [
      `estado_cuenta_cliente_${cliente.nombre}`,
      mesNumero ? nombreMes(mesNumero) : "",
      anioNumero ? anioNumero.toString() : ""
    ]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "_")
      .toLowerCase();

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

    // Configurar la fuente y tamaño para todo el documento
    doc.setFont("Helvetica", "normal"); // Misma fuente en todo el PDF
    doc.setFontSize(12); // Tamaño uniforme en todo el PDF

    // Encabezado del reporte
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 20, "F");
    doc.text("INSTITUTO DEL AGUA DEL ESTADO", 55, 10);
    doc.text("Reporte general de clientes", 70, 16);

    let startY = 30;
    let totalGeneral = 0; // Variable para acumular el total de todas las compras

    clientes.forEach((cliente, index) => {
      doc.text(`Cliente #${index + 1}: ${cliente.nombre}`, 10, startY);
      doc.text(`Deuda: $${cliente.deuda}`, 10, startY + 10);
      startY += 20;

      let totalCliente = 0; // Total individual por cliente

      cliente.compras.forEach((compra) => {
        const costoServicio = parseFloat(compra.servicio.costo.toString());
        const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
        const totalCompra = costoServicio * metrosCubicos;

        totalCliente += totalCompra; // Acumular total del cliente
        totalGeneral += totalCompra; // Acumular total general

        doc.text(`- Servicio: ${compra.servicio.descripcion}`, 10, startY);
        doc.text(`  Planta: ${compra.planta.nombre}`, 10, startY + 10);
        doc.text(`  Cantidad: ${metrosCubicos.toFixed(2)}`, 10, startY + 20);
        doc.text(`  Total: $${totalCompra.toFixed(2)}`, 10, startY + 30);

        startY += 40;
      });

      // Mostrar total de compras por cliente
      doc.text(`Total Compras Cliente: $${totalCliente.toFixed(2)}`, 10, startY);
      startY += 10;

      doc.line(10, startY, 200, startY);
      startY += 10;
    });

    // Espacio antes del total general
    startY += 10;

    // Mostrar total general de todas las compras
    doc.text(`TOTAL GENERAL DE COMPRAS: $${totalGeneral.toFixed(2)}`, 10, startY);

    // Generar y enviar el PDF
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_general.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error("Error al generar el reporte general:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reporte Mensual
// Reporte Mensual con parámetros y formato en pesos mexicanos
export const generateMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener mes y año desde query params, o usar el actual
    const monthParam = parseInt(req.query.mes as string);
    const yearParam = parseInt(req.query.anio as string);

    const today = new Date();
    const year = !isNaN(yearParam) ? yearParam : today.getFullYear();
    const month = !isNaN(monthParam) ? monthParam - 1 : today.getMonth(); // JS usa meses 0-11

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59); // último día del mes a las 23:59:59

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
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.text("INSTITUTO DE AGUA DEL ESTADO", 60, 10);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte Mensual", 80, 15);

    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    doc.text(`Mes: ${monthName} ${year}`, 75, 25);

    let startY = 40;
    let totalGeneral = 0;

    compras.forEach((compra, index) => {
      if (startY > 270) {
        doc.addPage();
        startY = 20;
      }

      const costoServicio = compra.servicio?.costo ? parseFloat(compra.servicio.costo.toString()) : 0;
      const metrosCubicos = compra.cantidadServicio ? parseFloat(compra.cantidadServicio.toString()) : 0;
      const totalCompra = costoServicio * metrosCubicos;

      const totalFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalCompra);

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Compra #${index + 1}`, 10, startY);
      doc.text(`Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, 10, startY + 5);
      doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"}`, 10, startY + 10);
      doc.text(`Cantidad: ${Math.floor(metrosCubicos)} m³`, 10, startY + 15);
      doc.text(`Total: ${totalFormatted}`, 10, startY + 20);

      startY += 30;
      totalGeneral += totalCompra;
    });

    // Total general
    const totalGeneralFormatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalGeneral);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Rojo para el texto
    doc.text(`Total General: ${totalGeneralFormatted}`, 130, startY);

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
