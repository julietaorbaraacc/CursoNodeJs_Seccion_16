//Externo
import { Schema, model } from "mongoose";

//Definimos que va a contener el producto
const productoSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
		unique: true
	},
	estado: {
		type: Boolean,
		default: true,
		required: true
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: "Usuario",
		required: true
	},
	precio: {
		type: Number,
		default: 0
	},
	categoria: {
		type: Schema.Types.ObjectId, //esto es para relacionar el type con el valor de mis categorias
		ref: "Categoria",
		required: true
	},
	descripcion: {
		type: String
	},
	disponible: {
		type: Boolean,
		default: true
	},
	img: {
		type: String
	}
});

//Este metodo se ejecuta cuando devuelvo el request en un json en el archivo user.js dentro de controllers
productoSchema.methods.toJSON = function () {
	//Con esta linea lo que hacemos con desestructuracion guardar todos los valores en producto menos password y __V, entonces asi retornamos solo los valores que queremos
	const { __v, estado, ...producto } = this.toObject();
	return producto;
};

const Producto = model('Producto', productoSchema);

export {
	Producto
} 