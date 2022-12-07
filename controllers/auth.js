//Externo
import bcryptjs from "bcryptjs";

//Interno
import { Usuario } from "../models/index.js";
import {
	generarJWT,
	googleVerify
} from "../helpers/index.js";

//Login normal, con los usuarios que tenemos en la base de datos
const login = async (req, res) => {
	const { correo, password } = req.body;

	try {
		// Verificar si el email existe
		const usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			return res.status(400).json({
				msg: "El usuario/password no es correcto. -- Correo"
			});
		}

		// Verificar si el usuario esta activo en la DB
		if (!usuario.estado) {
			return res.status(400).json({
				msg: "El usuario/password no es correcto. -- Estado: false"
			});
		}

		// Verificar la contraseña
		//con esto estamos comparando la password que tenemos del req y la comparamos con la que esta en la base de datos
		const validPassword = bcryptjs.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: "El usuario/password no es correcto. -- password"
			});
		}

		// Generar el JWT (jSon Web Token)
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token
		});
	} catch (error) {
		res.status(500).json({
			msg: "Hable con el administrador"
		});
	}
}

//Login/Signup de Google
const googleSignIn = async (req, res) => {
	//Tomamos el token que se seteo en el body previamente
	const { id_token } = req.body;

	try {
		//Verificamos que el token que guardamos arriba sea valido pasandolo como parametro, de la respuesta obtenemos el correo el nombre y la imagen
		const { correo, nombre, img } = await googleVerify(id_token);
		//Buscamos un usuario que en la DB de machee con el correo que traemos de la api en la linea de arriba
		let usuario = await Usuario.findOne({ correo });

		//Verificar si el usuario existe en la base de datos
		if (!usuario) {
			//Si el usuario no existe lo tengo que crear
			//Aca creo un objeto con toda la data que le voy a pasar a ese nuevo user
			const data = {
				nombre,
				correo,
				img,
				role: "USER_ROLE",
				password: ":P",
				google: true
			}

			//Reescribimos usuario como un nuevo usuario pasandole de parametro el objeto de la data
			usuario = new Usuario(data);
			//Guardamos ese usuario en la DB
			await usuario.save();
		}

		//Chequeamos si el estado del usuario esta en false y tiramos error
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "Hable con el administrador, usuario borrado."
			});
		}

		// Generar el JWT (jSon Web Token)
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token
		});

	} catch (error) {
		console.log(error);

		res.status(400).json({
			ok: false,
			msg: "El token no se pudo verificar."
		});
	}
}

//Generamos un nuevo token
const renovarToken = async (req, res) => {
	//Tomaos el usuario del request
	const { usuario } = req;
	//Generamos un token para ese usuario
	const token = await generarJWT(usuario.id);

	//Retornamos el usuario y el token nuevo
	res.json({
		usuario,
		token
	});
}

export {
	login,
	googleSignIn,
	renovarToken
}