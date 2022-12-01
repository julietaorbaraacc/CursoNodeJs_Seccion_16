//Externo
import { OAuth2Client } from "google-auth-library";

//Inicializamos la clase OAuth2Client y le pasamos de parametro el client_id que tenemos guardado en las variables de entorno
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Creamos una funcion asincrona para verificar el token que nos viene de la api es valido
async function googleVerify(token = "") {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID
	});
	//Obtenemos del payload el nombre la imagen y el mail y los retornamos
	const { name, picture, email } = ticket.getPayload();

	return {
		nombre: name,
		img: picture,
		correo: email
	}
}

export {
	googleVerify
}