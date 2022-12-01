import { Producto } from "../models/index.js";

//Buscar todos los productos activos
const obtenerProductos = async (req, res) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, productos] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query).
			populate("usuario", "nombre").
			populate("categoria", "nombre").
			skip(Number(desde)).
			limit(Number(limite))
	]);

	res.json({
		total,
		productos
	});
}

//Buscar un producto por ID
const obtenerProducto = async (req, res) => {
	const { id } = req.params;
	const producto = await Producto.findById(id);

	//Si el producto tiene estado false tira error
	if (!producto.estado) {
		return res.status(400).json({
			msg: `El producto ${producto.nombre} no está activo`
		});
	}

	res.json(producto);
}

//Crear un nuevo producto en la DB
const crearProducto = async (req, res) => {
	try {
		//Sacamos estado y usuario y devolvemos el resto
		const { estado, usuario, ...body } = req.body;

		//Chequeamos que no exista un producto grabado con ese nombre
		const productoDB = await Producto.findOne({ nombre: body.nombre });

		//Si productoDB existe tira el error
		if (productoDB) {
			return res.status(400).json({
				msg: `El producto ${productoDB.nombre} ya existe`
			});
		}

		//Generar la data a guardar
		const data = {
			...body,
			nombre: body.nombre.toUpperCase(),
			//Esta data nos viene del usuario que esta logueado en ese momento intentando crear la producto
			usuario: req.usuario._id,
		}

		//Grabamos el producto en la DB;
		const producto = new Producto(data);

		await producto.save();

		res.status(201).json(producto);
	} catch (error) {
		res.status(500).json({
			msg: "Hable con el administrador"
		});
	}
}

//Actualizar un producto existente
const actualizarProducto = async (req, res) => {
	const { id } = req.params;
	const { estado, usuario, ...data } = req.body; //sacamos estado y usuario para impedir que puedan pasar datos incorrectos

	//Dentro de data establecemos los datos para usuario y nombre
	if (data.nombre) {
		data.nombre = data.nombre.toUpperCase();
	}

	data.usuario = req.usuario._id;

	const producto = await Producto.findByIdAndUpdate(id, data);

	res.json(producto);
}

//Borrar un producto, ponerlo en estado false
const borrarProducto = async (req, res) => {
	const { id } = req.params;
	const producto = await Producto.findByIdAndUpdate(id, { estado: false });

	res.json(producto);
}

export {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto
}