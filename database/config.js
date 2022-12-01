//Externo
import mongoose from 'mongoose';

//Creamos una funcion asincrona para conectar nuestro proyecto a la base de datos
const dbConnection = async () => {
	//En el primer parametro pasamos los datos de conexionq ue tenemos guardados como variable de entorno en MONGODB_CNN, segundo pasamos las opciones en este caso es useNewUrlParser, y por ultimo pasamos un callback, paramanejar el error y el exito.
	mongoose.connect(process.env.MONGODB_CNN, { useNewUrlParser: true }, (err, res) => {
		if (err) throw err;

		console.log('Base de Datos ONLINE');
	});
};

export {
	dbConnection
}