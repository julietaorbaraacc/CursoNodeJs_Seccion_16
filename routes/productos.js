//Externo
//Desestructuramos router del paquete de express
import { Router } from 'express';
import { check } from 'express-validator';

//Interno
import {
	obtenerProductos,
	obtenerProducto,
	crearProducto,
	actualizarProducto,
	borrarProducto
} from '../controllers/index.js';
import {
	existeCategoriaPorID,
	existeProductoPorID
} from '../helpers/index.js';
import {
	validarCampos,
	validarJWT,
	adminRole
} from '../middlewares/index.js';

const routerProd = Router();

//Obtener todas los productos - publico
routerProd.get("/", obtenerProductos);

//Obtener un producto por id - publico
routerProd.get("/:id", [
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeProductoPorID),
	validarCampos
], obtenerProducto);

//Crear un producto - privado - cualquier persona con un token valido
routerProd.post("/", [
	validarJWT,
	check("nombre", "El nombre es obligatorio").not().isEmpty(),
	check("categoria", "No es un ID valido").isMongoId(),
	check("categoria").custom(existeCategoriaPorID),
	validarCampos
], crearProducto);

//Actualizar un producto - privado - cualquier persona con un token valido
routerProd.put("/:id", [
	validarJWT,
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeProductoPorID),
	validarCampos
], actualizarProducto);

//Borrar un producto - solo si es admin y tiene un token valido
routerProd.delete("/:id", [
	validarJWT,
	adminRole,
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeProductoPorID),
	validarCampos
], borrarProducto);

export {
	routerProd
}