import { Categoria } from "../models/index.js";

//Buscar todas las categorias activas
const obtenerCategorias = async (req, res) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query).
			populate("usuario", "nombre").
			skip(Number(desde)).
			limit(Number(limite))
	]);

	res.json({
		total,
		categorias
	});
}

//Buscar una categoria por ID
const obtenerCategoria = async (req, res) => {
	const { id } = req.params;
	const categoria = await Categoria.findById(id);

	//Si la categoria tiene estado false tira error
	if (!categoria.estado) {
		return res.status(400).json({
			msg: `La categoria ${categoria.nombre} no está activa`
		});
	}

	res.json(categoria);
}

//Crear una nueva categoria en la DB
const crearCategoria = async (req, res) => {
	try {
		//Tomamos el nombre de la categoria que viene en el body y lo ponemos en mayúscula
		const nombre = req.body.nombre.toUpperCase();

		//Chequeamos que no exista una categoria grabada con ese nombre
		const categoriaDB = await Categoria.findOne({ nombre });

		//Si categoriaDB existe tira el error
		if (categoriaDB) {
			return res.status(400).json({
				msg: `La categoria ${categoriaDB.nombre} ya existe`
			});
		}

		//Generar la data a guardar
		const data = {
			nombre,
			//Esta data nos viene del usuario que esta logueado en ese momento intentando crear la categoria
			usuario: req.usuario._id
		}

		//Grabamos la categoria en la DB;
		const categoria = new Categoria(data);
		await categoria.save();
		res.status(201).json(categoria);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Hable con el administrador"
		});
	}
}

//Actualizar una categoria existente
const actualizarCategoria = async (req, res) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body; //sacamos esdtado y usuario para impedir que puedan pasar datos incorrectos

	//Dentro de data establecemos los datos para usuario y nombre
	data.nombre = data.nombre.toUpperCase();
	data.usuario = req.usuario._id;

	const categoria = await Categoria.findByIdAndUpdate(id, data);

	res.json(categoria);
}

//Borrar una categoria, ponerla en estado false
const borrarCategoria = async (req, res) => {
	const { id } = req.params;
	const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

	res.json(categoria);
}

export {
	obtenerCategorias,
	obtenerCategoria,
	crearCategoria,
	actualizarCategoria,
	borrarCategoria
}