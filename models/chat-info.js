//Creamos la clase Mensaje
class Mensaje {
	constructor(uid, nombre, mensaje) {
		this.uid = uid;
		this.nombre = nombre;
		this.mensaje = mensaje;
	}
}

//Creamos la clase ChatMensajes
class ChatMensajes {
	constructor() {
		this.mensajes = [];
		this.usuarios = {};
	}

	//Obtenemos solo los ultimos 10 mensajes
	get ultimos10() {
		this.mensajes = this.mensajes.splice(0, 10);
		return this.mensajes;
	}

	//Obtenemos los usuarios
	get usuariosArr() {
		return Object.values(this.usuarios);
	}

	//Colocamos el nuevo mensaje primero
	enviarMensaje(uid, nombre, mensaje) {
		this.mensajes.unshift(
			new Mensaje(uid, nombre, mensaje)
		);
	}

	//Agregamos un nuevo usuario
	agregarUsuario(usuario) {
		this.usuarios[usuario.id] = usuario;
	}

	//Borramos el usuario cuando este se desconecta
	desconectarUsuario(id) {
		delete this.usuarios[id];
	}
}

export {
	ChatMensajes
}