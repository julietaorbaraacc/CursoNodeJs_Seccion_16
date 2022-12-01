//Externo
import jsonwebtoken from "jsonwebtoken";

//Interno
import { Usuario } from "../models/index.js";

const validarJWT = async (req, res, next) => {
	//Tomamos el token del header
	const token = req.header("x-token");

	//Si no hay token entonces devolvemos un error
	if (!token) {
		return res.status(401).json({
			msg: "No hay token en la petición."
		});
	}

	//Validamos el JWT
	try {
		//Chequeamos si el token es valido, pasamos el token y el secretprivatekey que tenemos en la variable global, esto nos va a decir si ese token es valido o no y del payload extraemos el uid que esta guardado en el token
		const { uid } = jsonwebtoken.verify(token, process.env.SECREORPRIVATEKEY);
		//Buscamos un usuario que tenga el uid que esta en el token
		const usuario = await Usuario.findById(uid);

		//Verificamos si existe un usuario con ese uid
		if (!usuario) {
			return res.status(401).json({
				msg: "El usuario no existe en la DB."
			});
		}

		//Verificamnos si el uid tiene estado: true
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "El usuario tiene estado: false."
			});
		}

		//Le pasamos a req.usuario el valor de usuario y con esto definimos cual es el usuario que esta autenticado, este valor va a persistir en el resto de middlewares y callbacks que hay llamados en el route.
		req.usuario = usuario;
		next();
	} catch (error) {
		console.log(error);

		return res.status(401).json({
			msg: "Token no válido"
		});
	}
}

export {
	validarJWT
}