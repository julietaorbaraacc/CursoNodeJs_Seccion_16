import {
	login,
	googleSignIn
} from './auth.js';
import {
	obtenerCategorias,
	obtenerCategoria,
	crearCategoria,
	actualizarCategoria,
	borrarCategoria
} from "./categorias.js";
import {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto
} from './productos.js';
import {
	usersGet,
	usersPut,
	usersPost,
	usersDelete
} from './user.js';
import { buscar } from './buscar.js';

export {
	login,
	googleSignIn,
	obtenerCategorias,
	obtenerCategoria,
	crearCategoria,
	actualizarCategoria,
	borrarCategoria,
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto,
	usersGet,
	usersPut,
	usersPost,
	usersDelete,
	buscar
}