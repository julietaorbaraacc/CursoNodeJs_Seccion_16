//Interno
import { comprobarJWT } from "../helpers/index.js";
import { ChatMensajes } from "../models/index.js";

//Instaciamos la clase ChatMensajes
const chatMensajes = new ChatMensajes();

//Creamos el controlador del socket para el backend
const socketController = async (socket, io) => {
	//Comprobamos que el JWT venga en el socket como un header extra
	const usuario = await comprobarJWT(socket.handshake.headers["x-token"]);

	//Si el usuario no tiene un JWT en el header el socket se desconecta
	if (!usuario) {
		return socket.disconnect();
	}

	//Agregar el usuario conectado al metodo agregarUsuario
	chatMensajes.agregarUsuario(usuario);

	//Emitir usuarios-activos y mostramos el arreglo usuariosArr en consola, esto es para todos los usuarios
	io.emit("usuarios-activos", chatMensajes.usuariosArr);

	//Cuando alguien se conecta le mandamos los ultimos 10 mensajes, esto es solo para el que se conecta
	socket.emit("recibir-mensajes", chatMensajes.ultimos10);

	//Conectar a una sala individual
	socket.join(usuario.id,);

	//Limpiar del array cuando un usuario se desconecta
	socket.on("disconnect", () => {
		//Ejecutamos el metodo desconectarUsuario pasando de parametro el usuario.id
		chatMensajes.desconectarUsuario(usuario.id);
		//Emitimos nuevamente el array actualizado
		io.emit("usuarios-activos", chatMensajes.usuariosArr);
	});

	//Escuchamos envia-mensaje y recibimos el uid y mensaje del front
	socket.on("enviar-mensaje", ({ uid, mensaje }) => {
		if (uid) {
			//Mensaje privado para un usuario especifico
			socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });

		} else {
			//Mensaje global
			//colocamos el mensaje que recimos del front en el array enviarMensaje, y le pasamos lo que va a guardar que es el id el nombre y el mensaje
			chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
			//Emitimos recibir mensajes y mostramos los ultimos 10 mensajes del array ultimos10
			io.emit("recibir-mensajes", chatMensajes.ultimos10);
		}
	});
}

export {
	socketController
}