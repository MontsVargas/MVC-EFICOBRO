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
   // Datos del cliente e instituto 
    const doc = new jsPDF();
    doc.setFillColor(173, 216, 230); // Azul muy bajito
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("INSTITUTO DEL AGUA DEL ESTADO", 55, 10);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte del cliente", 85, 16);

    let startY = 30;

    // Configurar fuente y tamaño
   doc.setFontSize(12);
   doc.setFont("Helvetica", "bold");

   // Dibujar el cuadro (x, y, ancho, alto)
   const cuadroX = 10; 
   const cuadroY = startY - 5; // Un poco más arriba para margen
   const cuadroAncho = 60; // Ancho del cuadro
   const cuadroAlto = 20; // Espacio suficiente para los datos

   doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto); // Dibujar cuadro

   // Agregar texto dentro del cuadro
   doc.setDrawColor(0); // Color del borde (Negro)
   doc.setFillColor(230, 230, 250); // Color de fondo (Lavanda)
   doc.rect(cuadroX, cuadroY, cuadroAncho, cuadroAlto, "FD"); // "FD" = Fill + Draw
   doc.text(`Cliente: ${cliente.nombre}`, 11,  startY + 1 );
   doc.text(`Dirección: ${cliente.direccion}`, 11, startY + 6);
   doc.text(`Teléfono: ${cliente.telefono}`, 11, startY + 10);

   startY += 40; // Mover la posición para el siguiente contenido

   let purchaseStartY = startY; // Posición inicial Y

cliente.compras.forEach((compra) => {
    const costoServicio = parseFloat(compra.servicio.costo.toString());
    const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
    const totalCompra = costoServicio * metrosCubicos;

    // Agregar datos de la compra en formato listado
    doc.setFontSize(10);
    doc.text(`Servicio: ${compra.servicio.descripcion}`, 10, purchaseStartY);
    doc.text(`Planta: ${compra.planta.nombre}`, 10, purchaseStartY + 10);
    doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, 10, purchaseStartY + 20);
    doc.text(`Total: $${totalCompra.toFixed(2)}`, 10, purchaseStartY + 30);

    // Espaciado entre cada compra
    purchaseStartY += 40; 
});

// Ajuste de `startY` para la siguiente sección del PDF
startY = purchaseStartY;

    // Total de compras
    let totalGastado = cliente.compras.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;
      return acc + totalCompra;
    }, 0);

    // Cuadro para el total
    doc.setLineWidth(1);
    doc.rect(60, startY, 70, 20);
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Rojo para el texto
    doc.text(`Total gastado: $${totalGastado.toFixed(2)}`, 95, startY + 13, { align: "center" });

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

//  Reporte Semanal de Compras
export const generateWeeklyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    // Definir el rango de la semana actual (de domingo a sábado)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Primer día de la semana (domingo)
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Último día de la semana (sábado)

    //  Obtener todas las compras dentro del rango semanal
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

    //  Crear el documento PDF
    const doc = new jsPDF();
    
    //  Encabezado del Reporte
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.text("INSTITUTO DE AGUA DEL ESTADO", 60, 10);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte Semanal", 80, 15);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text(`Semana: ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`, 75, 20);

    // Posiciones iniciales
    let startY = 30;
    let purchaseStartX = 10;
    let purchaseStartY = startY;

    // Iterar sobre las compras y mostrarlas en cuadros
    compras.forEach((compra, index) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      const totalCompra = costoServicio * metrosCubicos;

      // Control de posición para evitar que se salgan de la página
      if (purchaseStartX > 160) {
        purchaseStartX = 10;
        purchaseStartY += 50;
      }

      // Cuadro con información de cada compra
      doc.setLineWidth(0.5);
      doc.rect(purchaseStartX, purchaseStartY, 190, 50);
      doc.setFontSize(10);
      doc.text(`Servicio: ${compra.servicio.descripcion}`, purchaseStartX + 5, purchaseStartY + 10);
      doc.text(`Planta: ${compra.planta.nombre}`, purchaseStartX + 5, purchaseStartY + 20);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 30);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, purchaseStartX + 5, purchaseStartY + 40);

      purchaseStartX += 50; // Mover a la siguiente posición
    });

    //  Calcular el total semanal de compras
    let totalSemanal = compras.reduce((acc, compra) => {
      const costoServicio = parseFloat(compra.servicio.costo.toString());
      const metrosCubicos = parseFloat(compra.cantidadServicio.toString());
      return acc + (costoServicio * metrosCubicos);
    }, 0);

    // Cuadro para el total semanal
    doc.setLineWidth(1);
    doc.rect(10, purchaseStartY + 220, 190, 20);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text(`Total Semanal: $${totalSemanal.toFixed(2)}`, 100, purchaseStartY + 230, { align: "center" });

    // Generar y enviar el PDF
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_semanal.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error(" Error al generar el reporte semanal:", error);
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
    doc.setFillColor(173, 216, 230); // Azul claro
    doc.rect(0, 0, 210, 30, "F");
    doc.text("INSTITUTO DE AGUA DEL ESTADO", 60, 10);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.text("Reporte Mensual", 80, 15);

    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    doc.text(`Mes: ${monthName} ${startOfMonth.getFullYear()}`, 75, 25);

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

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Compra #${index + 1}`, 10, startY);
      doc.text(`Servicio: ${compra.servicio ? compra.servicio.descripcion : "N/A"}`, 10, startY + 5);
      doc.text(`Planta: ${compra.planta ? compra.planta.nombre : "N/A"}`, 10, startY + 10);
      doc.text(`Cantidad: ${metrosCubicos.toFixed(2)} m³`, 10, startY + 15);
      doc.text(`Total: $${totalCompra.toFixed(2)}`, 10, startY + 20);

      startY += 30;
      totalGeneral += totalCompra;
    });

    // Total general
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Rojo para el texto
    doc.text(`Total General: $${totalGeneral.toFixed(2)}`, 130, startY);

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
