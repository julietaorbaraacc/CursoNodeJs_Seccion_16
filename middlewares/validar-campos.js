//Externo
import { validationResult } from 'express-validator';

//Este middleware es para manejar los errores que vienen del response
const validarCampos = (req, res, next) => {
	const errors = validationResult(req); //para validar los errores, esto ya viene con express-validator, va a tirar true o false

	if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}

	//Como es un middleware recibe un tercer parametro que es next, con esto indicamos que si esta todo ok siga con el siguiente middleware
	next();
}

export {
	validarCampos
}