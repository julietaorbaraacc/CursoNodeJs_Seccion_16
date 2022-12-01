//Externo
import express from 'express';
import cors from 'cors';
import fileUpload from "express-fileupload";

//Interno
import { dbConnection } from '../database/config.js';
import {
	routerAuth,
	routerCat,
	routerProd,
	routerSearch,
	routerUser,
	routerUpload
} from '../routes/index.js';

//Creamos la clase Server en donde vamos a poner todas las configuraciones necesarias para servir el contenido
class Server {
	constructor() {
		//Seteamos 
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			auth: "/api/auth",
			search: "/api/search",
			categories: "/api/categories",
			products: "/api/products",
			users: "/api/users",
			uploads: "/api/uploads"
		}

		//Conectar a la base de datos
		this.conectarDB();

		//Middlewares
		this.middlewares();

		//Rutas de conexión
		this.routes();
	}

	//Creamos el metodo asincrono para llamar la db connection, le hacemos un await
	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		//CORS
		this.app.use(cors());

		//Lectura y parseo del body, aca leemos la data que nos estan enviando
		this.app.use(express.json());

		//Leemos la carpeta Publica
		this.app.use(express.static("public"));

		//Carga de archivos
		this.app.use(fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
			createParentPath: true //Esto lo que permite es crear un directorio si es requerido y no existe
		}));
	}

	routes() {
		//Lamamos la ruta del constructor y los callback de router
		this.app.use(this.paths.auth, routerAuth);
		this.app.use(this.paths.search, routerSearch);
		this.app.use(this.paths.categories, routerCat);
		this.app.use(this.paths.users, routerUser);
		this.app.use(this.paths.products, routerProd);
		this.app.use(this.paths.uploads, routerUpload);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Example app listening on port ${this.port}`);
		});
	}
}

export {
	Server
}