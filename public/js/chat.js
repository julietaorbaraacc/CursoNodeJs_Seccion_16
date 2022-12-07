const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://cursonodejs-seccion-16.onrender.com/api/auth/';
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");
const form = document.querySelector("form");
let socket = null;

//Validar el token del localStorage
const validarJWT = async () => {
	//Obtenemos el token guardado en el localStorage
	const tokenLocal = localStorage.getItem("token") || "";

	//Si el token tiene menos de 10 caracteres redirecciona al index y tira un error
	if (tokenLocal.length <= 10) {
		window.location = "index.html";
		throw new Error("No hay token en el servidor");
	}

	//Le envio al servidor un nuevo header, en donde establezco que x-token es igual al valor que tenemos en el localStorage
	const resp = await fetch(url, {
		headers: {
			"x-token": tokenLocal
		}
	});

	//Obtenemos de la respuesta el usuario y el token
	const { usuario, token } = await resp.json();

	//Steamos el nuevo token en el localStorage
	localStorage.setItem("token", token);
	//Ponemos el nombre de usuario en el title de la pagina
	document.title = usuario.nombre;

	//una vez que esta todo validado y corriendo llamamos al socket
	await conectarSocket();
}

//Creamos la conexion al socket con el front
const conectarSocket = async () => {
	socket = io({
		//Le seteamos un header propio en donde pasamos el x-token y el valor que tenemos en el localStorage, esto se comunica con el backend que como respuesta nos devuelve un nuevo token
		"extraHeaders": {
			"x-token": localStorage.getItem("token")
		}
	});

	socket.on("connect", () => {
		console.log("Sockets online");
	});

	socket.on("disconnect", () => {
		console.log("Sockets offline");
	});

	socket.on("recibir-mensajes", dibujarMensajes);

	socket.on("usuarios-activos", dibujarUsuarios);

	socket.on("mensaje-privado", (payload) => {
		console.log(payload);
	});
}

//Agreagamos al HTML de la lista los usuarios conectados
const dibujarUsuarios = (usuarios) => {
	let usersHtml = "";

	//Recorro cada usuario del array y contruyo el HTML en el array usersHtml
	usuarios.forEach(({ nombre, uid }) => {
		usersHtml += `
			<li>
				<h5 class="text-success">${nombre}</h5>
				<p class="text-mutted">${uid}</p>
			</li>
		`;
	});

	//coloco los items del array usersHtml en el HTML ulUsuarios
	ulUsuarios.innerHTML = usersHtml;
}

//Agreagamos al HTML los ultimos 10 mensajes
const dibujarMensajes = (mensajes) => {
	let mensajesHtml = "";

	//Recorro cada mensaje del array y contruyo el HTML en el array mensajesHtml
	mensajes.forEach(({ nombre, mensaje }) => {
		mensajesHtml += `
			<li>
				<span class="text-primary">${nombre}</span>
				<span>${mensaje}</span>
			</li>
		`;
	});

	//coloco los items del array mensajesHtml en el HTML ulMensajes
	ulMensajes.innerHTML = mensajesHtml;
}

//Escuchamos txtMensaje en el evento keyup
txtMensaje.addEventListener("keyup", ({ keyCode }) => {
	const mensaje = txtMensaje.value;
	const uid = txtUid.value;

	if (keyCode !== 13) return;
	if (mensaje.length === 0) return;

	//Emitimos enviar mensaje al back y le enviamos el mensaje y el uid
	socket.emit("enviar-mensaje", { mensaje, uid });

	//Limpiamos los valores del input una vez enviado el mensaje
	txtMensaje.value = "";
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
});

const main = async () => {
	await validarJWT();
}

main();