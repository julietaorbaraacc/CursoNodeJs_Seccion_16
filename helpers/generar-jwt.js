//Externo
import jsonwebtoken from "jsonwebtoken";
import { Usuario } from "../models/index.js";

//Esta funcion es para generar el token
const generarJWT = async (uid = "") => {
	return new Promise((resolve, reject) => {
		const payload = { uid };
		//Generamos el JWT, se pasan 4 parametros el primero es el payload, el segundo el secreteorprivatekey que es una llave secreta para firmar el token y esta guandado como variable de entrono, el tercero son las opciones como por ejemplo tiempo de expiracion, el cuarto es el callback, para disparar en caso de exito o error.
		jsonwebtoken.sign(payload, process.env.SECREORPRIVATEKEY, { expiresIn: "8h" }, (error, token) => {
			if (error) {
				console.log(error);
				reject("No se pudo generar el token.");
			} else {
				resolve(token);
			}
		});
	});
}

//Comprobamos el JWT
const comprobarJWT = async (token) => {
	try {
		//Si el token tiene 10 o menos caracteres entonces va a retornar un null
		if (token.length <= 10) {
			return null;
		}

		//Tomamos el token, lo desencriptamos y obtenemos el uid
		const { uid } = jsonwebtoken.verify(token, process.env.SECREORPRIVATEKEY);
		//Chequeamos que el uid exista en la DB
		const usuario = await Usuario.findById(uid);

		if (usuario) { //Si el usuario existe
			if (usuario.estado) {
				return usuario; //Si el estado del usuario es true retorna el usuario
			} else {
				return null; //Si el estado del usuario es false retorna null
			}
		} else {
			return null; //Si el usuario no existe retirna null
		}
	} catch (error) {
		console.log(error);
		return null
	}
}

export {
	generarJWT,
	comprobarJWT
}