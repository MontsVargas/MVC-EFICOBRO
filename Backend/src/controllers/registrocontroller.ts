import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Para encriptar la contraseña
import validator from "validator"; // Para validar el formato del correo

const prisma = new PrismaClient();

export const registroUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, correo, contrasenia, telefono } = req.body;

    // Validaciones de los campos
    if (!nombre || !correo || !contrasenia || !telefono) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
      return;
    }

    // Validación del formato del correo
    if (!validator.isEmail(correo)) {
      res.status(400).json({ message: "El correo no tiene un formato válido" });
      return;
    }

    // Validación de la longitud de la contraseña (al menos 8 caracteres)
    if (contrasenia.length < 8) {
      res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
      return;
    }

    // Validación de número de teléfono (ajustar según el formato que necesites)
    if (!/^\d{10}$/.test(telefono)) {
      res.status(400).json({ message: "El número de teléfono no es válido" });
      return;
    }

    // Verificar si el correo ya está registrado en la base de datos
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuarioExistente) {
      res.status(400).json({ message: "El correo ya está registrado" });
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    // Crear el nuevo usuario en la base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasenia: hashedPassword,
        telefono,
      },
    });

    // Responder con éxito
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        telefono: nuevoUsuario.telefono,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({
      message: "Error al registrar el usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
