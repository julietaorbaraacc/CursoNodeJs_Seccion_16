//Externo
//Desestructuramos router del paquete de express
import { Router } from 'express';
import { check } from 'express-validator';

//Interno
import {
	usersGet,
	usersPut,
	usersPost,
	usersDelete
} from '../controllers/index.js';
import {
	emailExiste,
	rolValido,
	usuarioExistePorID
} from '../helpers/index.js';
import {
	validarCampos,
	validarJWT,
	adminRole,
	tieneRole
} from '../middlewares/index.js';

//Guardamos router en una variable
const routerUser = Router();

//Seteamos lo necesario, los callback se llaman de controllers importados mas arriba
routerUser.get("/", usersGet);

//En este caso estamos tomando un valor de la URL, podemos ponerle el nombre que querramos, es un parametro. Esto ya viene configurado en express que lo parasea y lo devuelve en los parms
routerUser.put("/:id", [
	check("id", "No es un ID valido").isMongoId(), //chequeamos que el id de la url sea un id valido de mongodb
	check("id").custom(usuarioExistePorID), //chequeamos que el id exista en la base de datos
	check("role").custom(rolValido), //chequea que el rol sea valido
	validarCampos
], usersPut);

routerUser.post("/", [
	check("nombre", "El nombre es obligatorio.").not().isEmpty(), //Esto significa el nombre no tiene que estar vacio
	check("password", "El password debe tener mínimo 6 letras.").isLength({ min: 6 }),
	check("correo", "El correo no es válido.").isEmail(), //chequea que el email sea valido
	check("correo").custom(emailExiste), //chequea que el correo no exista en la base de datos
	check("role").custom(rolValido), //chequea que el rol sea valido
	validarCampos //todos los erores de arriba se guardan y se pasan mediante el request a esta funcion que los valida
], usersPost); //espress-validator es una coleccion de middlewares, que son funciones que se ejecutan antes de otra peticion, se pasa como segundo parametro y valida antes de llamar al callback.

routerUser.delete("/:id", [
	validarJWT,
	//adminRole,
	tieneRole("ADMIN_ROLE", "USER_ROLE"),
	check("id", "No es un ID valido").isMongoId(), //chequeamos que el id de la url sea un id valido de mongodb
	check("id").custom(usuarioExistePorID), //chequeamos que el id exista en la base de datos
	validarCampos
], usersDelete);

export {
	routerUser
}