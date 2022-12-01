//Externo
//Desestructuramos router del paquete de express
import { Router } from 'express';
import { check } from 'express-validator';

//Interno
import {
	validarArchivoSubir,
	validarCampos
} from '../middlewares/index.js';
import {
	cargarArchivo,
	mostrarImagen,
	actualizarImagenCloudinary
} from '../controllers/index.js';
import { coleccionesPermitidas } from '../helpers/index.js';

const routerUpload = Router();

routerUpload.post("/", validarArchivoSubir, cargarArchivo);

routerUpload.put("/:coleccion/:id", [
	validarArchivoSubir,
	check("id", "No es un ID valido").isMongoId(),
	check("coleccion").custom(coleccion => coleccionesPermitidas(coleccion, ["users", "products"])),
	validarCampos
], actualizarImagenCloudinary);

routerUpload.get("/:coleccion/:id", [
	check("id", "No es un ID valido").isMongoId(),
	check("coleccion").custom(coleccion => coleccionesPermitidas(coleccion, ["users", "products"])),
	validarCampos
], mostrarImagen);

export {
	routerUpload
}