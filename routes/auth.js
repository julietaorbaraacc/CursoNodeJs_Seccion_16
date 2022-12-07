//Externo
//Desestructuramos router del paquete de express
import { Router } from 'express';
import { check } from 'express-validator';

//Interno
import {
	googleSignIn,
	login,
	renovarToken
} from '../controllers/index.js';
import {
	validarCampos,
	validarJWT
} from '../middlewares/index.js';

const routerAuth = Router();

routerAuth.post("/login", [
	check("correo", "El correo es obligatorio.").isEmail(), //chequea que el email sea valido
	check("password", "El password es obligatorio").not().isEmpty(),
	validarCampos
], login);

//Creamos la authenticacion de Google
routerAuth.post("/google", [
	check("id_token", "El token de google es necesario.").not().isEmpty(),
	validarCampos
], googleSignIn);

//Validamos el token existente y generamos uno nuevo, se genera uno nuevo en cada recarga de la pagina
routerAuth.get("/", validarJWT, renovarToken);

export {
	routerAuth
}