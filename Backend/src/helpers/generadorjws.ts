import jwt from 'jsonwebtoken';

// Función para generar un JWT
const generarJWT = (uid: number, nombre: string) => {
    // Verificar si la clave secreta está definida
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido');
    }
    // Firmar el JWT con los datos y la clave secreta
    return jwt.sign({ uid: String(uid), nombre }, process.env.JWT_SECRET, {
        expiresIn: '12h' // Establecer el tiempo de expiración en 12 horas
    });
}

export default generarJWT;
 