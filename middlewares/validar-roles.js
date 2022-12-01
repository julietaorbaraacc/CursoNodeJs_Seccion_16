const adminRole = (req, res, next) => {
	//Podemos llamar req.usuario porque los valores que se establecen en middlewares anteriores persisten y se pueden usar en los proximos middlewares y callbacks
	//Es para chequear que el valor de req.usuario no venga undefined 
	if (!req.usuario) {
		return res.status(500).json({
			msg: "Se quiere verificar el rol sin validar el token primero."
		});
	}

	const { role, nombre } = req.usuario;

	if (role !== "ADMIN_ROLE") {
		return res.status(401).json({
			msg: `El usuario ${nombre} no es administrador, su rol es ${role}.`
		});
	}

	next();
}

//Como en este caso estamos pasando argumentos que son diferentes de los de un middleware, necesitamos retornar una funcion en donde ahi si pasemos los argumentos del middleware. estamos recibiendo roles, como no sabemos el numero especifico de roles que se pasara por eso se recibe con los ... y los tranforma en un arreglo.
const tieneRole = (...roles) => {
	return (req, res, next) => {
		//Es para chequear que el valor de req.usuario no venga undefined 
		if (!req.usuario) {
			return res.status(500).json({
				msg: "Se quiere verificar el rol sin validar el token primero."
			});
		}

		//Si el rol del usuario no esta dentro de los que le pasaron como argumento dispara este error
		if (!roles.includes(req.usuario.role)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}.`
			});
		}

		next();
	}
}

export {
	adminRole,
	tieneRole
}