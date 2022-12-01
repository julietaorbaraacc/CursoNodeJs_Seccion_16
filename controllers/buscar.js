//Externo
import mongoose from "mongoose";

//Interno
import {
	Usuario,
	Producto,
	Categoria
} from "../models/index.js"

//Definimos las colecciones permitidas en la busqueda
const coleccionesPermitidas = [
	"categorias",
	"productos",
	"usuarios"
];

const buscarUsuarios = async (termino = "", res) => {
	//Busqueda por id
	//Validamos que el id que nos pasaron en el termino sea valido
	const esMongoID = mongoose.Types.ObjectId.isValid(termino);

	//Si el id es valido entonces lo que hacemos es buscar un usuario con ese id y generar la respuesta en un arreglo
	if (esMongoID) {
		const usuario = await Usuario.findById(termino);

		return res.json({
			results: (usuario) ? [usuario] : [] //Si el usuario existe retornamos un arreglo con el usuario, si no existe eretirnamos un arrglo vacío
		});
	}

	//Busqueda por termino
	//Con esto definimos que el termino no sea casesensitive, asi no discrimina por mayusculas y minusculas
	const regex = new RegExp(termino, "i");

	//Buscamos en los usuarios uno que contenga en el nombre o correo el termino buscado
	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }], //Con esta linea validamos que el nombre o el correo contengan el termino que ciene del regex
		$and: [{ estado: true }] //Validamos que esté activo
	});

	//Devolvemos el resultado
	res.json({
		results: usuarios
	});
};

const buscarCategorias = async (termino = "", res) => {
	const esMongoID = mongoose.Types.ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);

		return res.json({
			results: (categoria) ? [categoria] : []
		});
	}

	const regex = new RegExp(termino, "i");
	const categorias = await Categoria.find({ nombre: regex, estado: true });

	res.json({
		results: categorias
	});
};

const buscarProductos = async (termino = "", res) => {
	const esMongoID = mongoose.Types.ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino).populate("categoria", "nombre");

		return res.json({
			results: (producto) ? [producto] : []
		});
	}

	const regex = new RegExp(termino, "i");
	const productos = await Producto.find({ nombre: regex, estado: true }).populate("categoria", "nombre");

	res.json({
		results: productos
	});
};

const buscar = (req, res) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
		});
	}

	switch (coleccion) {
		case "categorias":
			buscarCategorias(termino, res);
			break;
		case "productos":
			buscarProductos(termino, res);
			break;
		case "usuarios":
			buscarUsuarios(termino, res);
			break;

		default:
			res.status(500).json({
				msg: "Se le olvidó hacer una búsqueda"
			});
	}
}

export {
	buscar
}