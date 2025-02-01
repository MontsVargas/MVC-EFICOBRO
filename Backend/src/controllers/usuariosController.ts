import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import generateJWT from '../helpers/generadorjws';

const prisma = new PrismaClient();

const registro = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, contrasenia, telefono } = req.body;

        if (!nombre || !correo || !contrasenia || !telefono) {

            return res.status(400).json({mensaje:"TODOS LOS CAMPOS SON OBLIGATORIOS"});

        }
        const usuarioExiste = await prisma.usuario.findFirst({
            where:{
                correo
            }
        });

        if (usuarioExiste !== null) {
            return res.status(409).json({ mensaje:"EL USUARIO YA EXISTE"});
        }

        const contraseniaHasheada = await bcrypt.hash(contrasenia,10);
        await prisma.usuario.create({
            data:{
                nombre,
                correo,
                contrasenia: contraseniaHasheada,
                telefono
            }
        });
        
        return res.status(200).json({mensaje: "USUARIO REGISTRADO CORRECTAMENTE"});
    } catch (error) {
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
}
};
//AQUI ESTOY CREANDO UN USUARIO EN MI MODELO USUARIO Y ESTOY INCRIPTANDO LA CONTRASEÑA CON LA FUNCION DE HASHING bcrypt.


const iniciarSesion = async (req: Request, res: Response) => {
    try {
        const { correo, contrasenia } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({ mensaje: "TODOS LOS CAMPOS SON OBLIGATORIOS" });
        }

        const usuario = await prisma.usuario.findFirst({
            where: {
                correo
            },
            select: {
                contrasenia: true,
                id: true,
                nombre: true
            }
        });

        if (usuario === null) {
            return res.status(404).json({ mensaje: "El USUARIO NO EXISTE" });
        }

        const contraseñaCoincide = await bcrypt.compare(contrasenia, usuario.contrasenia);

        if (!contraseñaCoincide) {
            return res.status(401).json({ mensaje: "CONTRASEÑA INCORRECTA" });
        }

        const token = generateJWT(usuario.id, usuario.nombre);

        res.cookie('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
        });

        return res.status(200).json({ mensaje: "USUARIO LOGUEADO CORRECTAMENTE" });
    } catch (error) {
        return res.status(500).json({ mensaje: "ERROR DEL SERVIDOR" });
    }
};
//AQUI ESTOY HACIENDO QUE SE CONFIRME EL USUARIO Y VERIFICO LA CONTRASEÑA A LA VEZ QUE GENERO EL TOKEN JWK ESO ES UNA TIPO FIRMA EN CLABE 

const cerrarSesion = async (req: Request, res: Response) => {
    try {
        res.clearCookie('auth-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        return res.status(200).json({ mensaje: "Usuario deslogueado correctamente" });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

//ESTO ELIMINA EL TOKEN JWT PARA CERRAR LA SESION DEL USUARIO.

export {
    registro,
    iniciarSesion,
    cerrarSesion,

}