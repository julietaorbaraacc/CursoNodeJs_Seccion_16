//Externo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary'

//Interno
import { subirArchivo } from "../helpers/index.js";
import {
	Usuario,
	Producto
} from "../models/index.js";


const cargarArchivo = async (req, res) => {
	//Llamamos el helper que contiene una promesa dentro de un try/catch para que cuando nos de un error en el reject podamos manejar ese error correctamente, si no lo hacemos asi explota al tirar un error
	try {
		//Llamamos al helper para subir un archivo
		const nombre = await subirArchivo(req.files, undefined, "imgs");

		//Retornamos el helper en la propiedad nombre
		res.json({
			nombre
		});
	} catch (error) {
		console.log(error);

		res.status(400).json({
			error
		});
	}
}

const actualizarImagen = async (req, res) => {
	const { id, coleccion } = req.params;
	let modelo;

	//Manejamos los errores, en este caso vamos a chequear que el id pasado exista en la coleccion, sino existe debe tirar error
	switch (coleccion) {
		case "users":
			modelo = await Usuario.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`
				});
			}
			break;

		case "products":
			modelo = await Producto.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`
				});
			}
			break;

		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto"
			});
	}

	try {
		//Chequemos que el id del producto o usuario tenga una imagen guardada en la DB
		if (modelo.img) {
			//Esto es para quie funcione el dirname, siempre va de la mano con el import del path y del fileURLToPath
			const __dirname = path.dirname(fileURLToPath(import.meta.url));
			//Obtenemos el path de la imagen en el servidor
			const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);

			//Si la imagen existe
			if (fs.existsSync(pathImagen)) {
				//Borramos la imagen del server
				fs.unlinkSync(pathImagen);
			}
		}

		//Llamamos al helper subirArchivo
		const nombre = await subirArchivo(req.files, undefined, coleccion);
		modelo.img = nombre; //Le asignamos la imagen al producto/usuario
		await modelo.save(); //Guardamos el cambios en la DB

		res.json(modelo);
	} catch (error) {
		console.log(error);

		res.status(400).json({
			error
		});
	}
}

const actualizarImagenCloudinary = async (req, res) => {
	const { id, coleccion } = req.params;
	let modelo;

	//Manejamos los errores, en este caso vamos a chequear que el id pasado exista en la coleccion, sino existe debe tirar error
	switch (coleccion) {
		case "users":
			modelo = await Usuario.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`
				});
			}
			break;

		case "products":
			modelo = await Producto.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`
				});
			}
			break;

		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto"
			});
	}

	try {
		//Conectamos con cloudinary
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			secure: true
		});

		//Chequemos que el id del producto o usuario tenga una imagen guardada en la DB
		if (modelo.img) {
			//Tomamos el valor guardado en modelo.img y lo separamos por / en un array
			const nombreArr = modelo.img.split("/");
			//Obtenemos el ultimo valor del array que seria el archivo.ext
			const nombre = nombreArr[nombreArr.length - 1];
			//Obtenermos el pimer elemento del array que seria el id de la imagen y es lo que nos va a servir para borrarla
			const [publicId] = nombre.split(".");

			//Eliminamos la imagen del servidor
			await cloudinary.uploader.destroy(publicId);

		}

		//Tomamos el path temporal en donde esta alojada la imagen que queremos subir
		const { tempFilePath } = req.files.archivo;
		//Tomamos el secure_url de la imagen ya guardada en cloudinary
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		modelo.img = secure_url; //Le asignamos secure_url al producto/usuario
		await modelo.save(); //Guardamos el cambios en la DB

		res.json(modelo);

	} catch (error) {
		console.log(error);

		res.status(400).json({
			error
		});
	}
}

const mostrarImagen = async (req, res) => {
	const { id, coleccion } = req.params;
	let modelo;
	//Esto es para quie funcione el dirname, siempre va de la mano con el import del path y del fileURLToPath
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	//Manejamos los errores, en este caso vamos a chequear que el id pasado exista en la coleccion, sino existe debe tirar error
	switch (coleccion) {
		case "users":
			modelo = await Usuario.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`
				});
			}
			break;

		case "products":
			modelo = await Producto.findById(id);

			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`
				});
			}
			break;

		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto"
			});
	}

	try {
		//Chequemos que el id del producto o usuario tenga una imagen guardada en la DB
		if (modelo.img) {
			//Obtenemos el path de la imagen en el servidor
			const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);

			//Si la imagen existe
			if (fs.existsSync(pathImagen)) {
				//Devolvemos la imagen
				return res.sendFile(pathImagen);
			}
		}

		//Si la imagen no existe entonces vamos a devolver la no-image
		const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

		res.sendFile(pathImagen);
	} catch (error) {
		console.log(error);

		res.status(400).json({
			error
		});
	}
}

export {
	cargarArchivo,
	actualizarImagen,
	actualizarImagenCloudinary,
	mostrarImagen
}