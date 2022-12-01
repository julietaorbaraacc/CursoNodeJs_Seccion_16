//Externo
//Desestructuramos router del paquete de express
import { Router } from 'express';
import { check } from 'express-validator';

//Interno
import {
	obtenerCategorias,
	obtenerCategoria,
	crearCategoria,
	actualizarCategoria,
	borrarCategoria
} from '../controllers/index.js';
import { existeCategoriaPorID } from '../helpers/index.js';
import {
	validarCampos,
	validarJWT,
	adminRole
} from '../middlewares/index.js';

const routerCat = Router();

//Obtener todas las categorias - publico
routerCat.get("/", obtenerCategorias);

//Obtener una categoria por id - publico
routerCat.get("/:id", [
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeCategoriaPorID),
	validarCampos
], obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token valido
routerCat.post("/", [
	validarJWT,
	check("nombre", "El nombre es obligatorio").not().isEmpty(),
	validarCampos
], crearCategoria);

//Actualizar una categoria - privado - cualquier persona con un token valido
routerCat.put("/:id", [
	validarJWT,
	check("nombre", "El nombre es obligatorio").not().isEmpty(),
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeCategoriaPorID),
	validarCampos
], actualizarCategoria);

//Borrar una categoria - solo si es admin y tiene un token valido
routerCat.delete("/:id", [
	validarJWT,
	adminRole,
	check("id", "No es un ID valido").isMongoId(),
	check("id").custom(existeCategoriaPorID),
	validarCampos
], borrarCategoria);

export {
	routerCat
}