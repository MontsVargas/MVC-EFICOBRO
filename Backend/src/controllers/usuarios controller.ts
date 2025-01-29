import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import generateJWT from '../helpers/generateJWT';

const prisma = new PrismaClient();

const register = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, contrasenia, telefono } = req.body;

        if (!nombre || !correo || !contrasenia || !telefono) {

            return res.status(400).json({message:"TODOS LOS CAMPOS SON OBLIGATORIOS"});

        }
        const userExists = await prisma.usuario.findFirst({
            where:{
                correo
            }
        });

        if (userExists !== null) {
            return res.status(409).json({ message:"EL USUARIO YA EXISTE"});
        }

        const hashedPassword = await bcrypt.hash(contrasenia,10);
        await prisma.usuario.create({
            data:{
                nombre,
                correo,
                contrasenia: hashedPassword,
                telefono
            }
        });
        
        return res.status(200).json({message: "USUARIO REGISTRADO CORRECTAMENTE"});
    } catch (error) {
        return res.status(500).json({ message: "ERROR DEL SERVIDOR" });
}
};
//AQUI ESTOY CREANDO UN USUARIO EN MI MODELO USUARIO Y ESTOY INCRIPTANDO LA CONTRASEÑA CON LA FUNCION DE HASHING bcrypt.


const login = async (req: Request, res: Response) => {
    try {
        const { correo, contrasenia } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({ message: "TODOS LOS CAMPOS SON OBLIGATORIOS" });
        }

        const user = await prisma.usuario.findFirst({
            where: {
                correo
            },
            select: {
                contrasenia: true,
                id: true,
                nombre: true
            }
        });

        if (user === null) {
            return res.status(404).json({ message: "El USUARIO NO EXISTE" });
        }

        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);

        if (!passwordMatch) {
            return res.status(401).json({ message: "CONTRASEÑA INCORRECTA" });
        }

        const token = generateJWT(user.id, user.nombre);

        res.cookie('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
        });

        return res.status(200).json({ message: "USUARIO LOGUEADO CORRECTAMENTE" });
    } catch (error) {
        return res.status(500).json({ message: "ERROR DEL SERVIDOR" });
    }
};
//AQUI ESTOY HACIENDO QUE SE CONFIRME EL USUARIO Y VERIFICO LA CONTRASEÑA A LA VEZ QUE GENERO EL TOKEN JWK ESO ES UNA TIPO FIRMA EN CLABE 

const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('auth-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        return res.status(200).json({ message: "Usuario deslogueado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

//ESTO ELIMINA EL TOKEN JWT PARA CERRAR LA SESION DEL USUARIO.