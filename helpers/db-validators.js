//Interno
import {
	Categoria,
	Producto,
	Role,
	Usuario
} from "../models/index.js";

//Chequeamos que el rol sea un rol valido de la base de datos
const rolValido = async (role = "") => {
	const existeRol = await Role.findOne({ role });

	if (!existeRol) {
		throw new Error(`El rol ${role} no está registrado en la base de datos.`);
	}
}

//Chequeamos que el email ya existe en la base de datos
const emailExiste = async (correo = "") => {
	const existeEmail = await Usuario.findOne({ correo }); //esto va a buscar un correo que sea igual al que le estoy pasando

	if (existeEmail) {
		throw new Error(`El correo ${correo} ya está registrado.`);
	}
}

//Chequeamos que el usuario exista en la base de datos
const usuarioExistePorID = async (id) => {
	const existeUsuario = await Usuario.findById(id); //esto va a buscar un correo que sea igual al que le estoy pasando

	if (!existeUsuario) {
		throw new Error(`El ID ${id} no existe.`);
	}
}

//Chequeamos que la categoria exista en la base de datos
const existeCategoriaPorID = async (id) => {
	const existeCategoria = await Categoria.findById(id); //esto va a buscar una categoria que sea igual al que le estoy pasando

	if (!existeCategoria) {
		throw new Error(`La categoria ${id} no existe.`);
	}
}

//Chequeamos que el producto exista en la base de datos
const existeProductoPorID = async (id) => {
	const existeProducto = await Producto.findById(id); //esto va a buscar una categoria que sea igual al que le estoy pasando

	if (!existeProducto) {
		throw new Error(`El producto ${id} no existe.`);
	}
}

//Validar colecciones
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
	//Chequear si la coleccion esta dentro de las colecciones permitidas
	const incluida = colecciones.includes(coleccion);

	if (!incluida) {
		throw new Error(`La coleccion ${coleccion} no es válida, las colecciones permitidas son ${colecciones}`);
	}

	return true;
}

export {
	rolValido,
	emailExiste,
	usuarioExistePorID,
	existeCategoriaPorID,
	existeProductoPorID,
	coleccionesPermitidas
}