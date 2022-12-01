//Externo
import jsonwebtoken from "jsonwebtoken";

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

export {
	generarJWT
}