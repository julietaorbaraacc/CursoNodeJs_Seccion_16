//Externo
import bcryptjs from "bcryptjs";

//Interno
import { Usuario } from "../models/index.js";

//Creamos las funciones

//GET Method se usa para obtener data del servidor
const usersGet = async (req, res) => {
	//Tomamos los valores que vienen de la url, seteamos valores por defecto en caso de que el usuario no los especifique
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	//Lo hacemos a modo de promesa para que lo ejecute todo de manera simultanea y tarde menos, recordar que el await es un bloqueante asi que si los hacemos por fuera de la promesa en await separados hay que esperar a que cada await se ejecute lo cual implica mas tiempo de espera de la respuesta, de esta manera tarda menos, pero el await en la promesa es necesario para darle tiempo a que termine y no se dispare la respuesta antes de tiempo. Por ultimo hacemos una desestructuracion pero de arreglos, en donde total corresponde al resultado de la primer promesa y usuarios a la segunda.
	const [total, usuarios] = await Promise.all([
		//para saber el total de usuarios que tenemos en la BD, le pasamos los que estan en estado true para que nos traiga solo los usuarios activos.
		Usuario.countDocuments(query),
		//con find le decimos que queremos que busque solo los usuarios que estan activos, con skip le pasamos el valor desde y con limit hasta.
		Usuario.find(query).skip(Number(desde)).limit(Number(limite))
	]);

	res.json({
		total,
		usuarios
	});
}

//PUT Method se usa para enviar un update a un recurso existente
const usersPut = async (req, res) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	//Validar contra base de datos
	if (password) {
		//Encriptar la contraseña
		const salt = bcryptjs.genSaltSync(); //el salt es el numero de vueltas para hacer mas complicado la desencriptacion, el default es 10 si no paso valor
		resto.password = bcryptjs.hashSync(password, salt); //tomamos el password lo encriptamos y guardamos eso en el password que viene de usuario
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json(usuario);
}

//Post Method se usa para enviar data al servidor
const usersPost = async (req, res) => {
	const { nombre, correo, password, role } = req.body;
	const usuario = new Usuario({ nombre, correo, password, role });

	//Encriptar la contraseña
	const salt = bcryptjs.genSaltSync(); //el salt es el numero de vueltas para hacer mas complicado la desencriptacion, el default es 10 si no paso valor
	usuario.password = bcryptjs.hashSync(password, salt); //tomamos el password lo encriptamos y guardamos eso en el password que viene de usuario

	//Guardar en DB
	await usuario.save(); // con este comando le decimos a mongoose que guande ese usuario en la base de datos

	//Se regresa el usuario grabado en un json
	res.json(usuario);
}

//Delete Method es para borrar un recurso del server
const usersDelete = async (req, res) => {
	const { id } = req.params;

	//Fisicamente lo borramos, de esta manera no se deberia hacer pero es para que lo sepamos
	//const usuario = await Usuario.findByIdAndDelete(id);

	//Buscamos el usuario con el id que mandamos en la url y le ponemos el estado en false
	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
	res.json(usuario);
}

export {
	usersGet,
	usersPut,
	usersPost,
	usersDelete
}