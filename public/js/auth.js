//Creamos la url con dos variaciones una para el localhost y otra para produccion que es de donde van a provenir mis datos
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://cursonodejs-seccion-16.onrender.com/api/auth/';
const formulario = document.querySelector("form");

//En el submit del form ejecutamos lo siguiente
formulario.addEventListener("submit", ev => {
	ev.preventDefault();
	const inputs = formulario.elements;
	const formData = {};

	//Recorremos cada uno de los elementos del formulario y chequeamos que tenga el atributo value, si lo tiene va a llenar el objeto formData con el nombre y el valor correspondiente
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].name.length) {
			formData[inputs[i].name] = inputs[i].value;
		}
	}

	//El fetch trabaja a base de promesas, enviamos los valores que obtuvimos en el formData a nuestro backend
	//Realizamos un solicitud a la url, que en este caso seria la url + login, pasamos los datos mediante una solicitud post
	fetch(url + "login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(formData) //le enviamos el objeto formData
	})
		.then(resp => resp.json()) //Se resuelve la promesa, al obtener la respuesta se pasa a formato json
		.then(resp => { //Leemos la respuesta y seteamos el localStorage
			//Si la respuesta contiene msg entonces ejecuta el return
			if (resp.msg) {
				return console.log(resp.msg);
			}

			//Si todo pasa correctamente, seteamos en el localStorage el token
			localStorage.setItem("token", resp.token);
			window.location = "chat.html" // Una vez logueados redireccionamos a la pagina del chat
		})
		.catch(err => { //Si hay un error mostramos el error en consola
			console.log(err);
		})
});

//Signup/Login de Google
function handleCredentialResponse(response) {
	//Creamos la constante body y le guardamos en valor id_token el response.credential que viene de la API
	const body = { id_token: response.credential }

	//Con fetch en este caso la url agrega "google", enviamos mediante post el body que obtuvimos arriba
	fetch(url + "google", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
		.then(resp => resp.json())
		.then(resp => {
			//Seteamos en el localStorage los valores para email y token
			localStorage.setItem("email", resp.usuario.correo);
			localStorage.setItem("token", resp.token);
			window.location = "chat.html" // Una vez logueados redireccionamos a la pagina del chat
		})
		.catch(console.warn);
}

//Hacemos el logout de google
const button = document.getElementById("google_signout");
button.addEventListener("click", () => {
	google.accounts.id.disableAutoSelect();
	google.accounts.id.revoke(localStorage.getItem("email"), done => {
		localStorage.clear();
		location.reload();
	});
});