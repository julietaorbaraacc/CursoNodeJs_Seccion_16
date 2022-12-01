//Externo
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = "") => {
	return new Promise((resolve, reject) => {
		//Del argumento files desestructuramos el archivo
		const { archivo } = files;
		//Separamos las palabras del nombre del archivo que contengan un . y guardamos todo en un array
		const nombreCortado = archivo.name.split(".");
		//Obtenemos el ultimo item del array que siempre es la extension del archivo
		const extension = nombreCortado[nombreCortado.length - 1];

		//Validar que la extension del archivo esté dentro de las permitidas, si no esta permitida tira error
		if (!extensionesValidas.includes(extension)) {
			return reject(`La extension ${extension} no esta permitida, las extensiones permitidas son ${extensionesValidas}`);
		}

		//Generamos un nombre random para el archivo y lo concatenamos con la extension
		const nombreTemp = uuidv4() + "." + extension;
		//Esto es para quie funcione el dirname, siempre va de la mano con el import del path y del fileURLToPath
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		//Generamos el path en donde vamos a guardar el archivo y le pasamos el nombre generado arriba
		const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

		//Movemos el archivo al path generado arriba
		archivo.mv(uploadPath, (err) => {
			if (err) {
				console.log(err)
				return reject(err);
			}

			resolve(nombreTemp);
		});
	});
}

export {
	subirArchivo
}