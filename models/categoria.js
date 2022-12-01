//Externo
import { Schema, model } from "mongoose";

//Definimos que va a contener la categoria
const categoriaSchema = Schema({
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
	}
});

//Este metodo se ejecuta cuando devuelvo el request en un json en el archivo user.js dentro de controllers
categoriaSchema.methods.toJSON = function () {
	//Con esta linea lo que hacemos con desestructuracion guardar todos los valores en usuario menos password y __V, entonces asi retornamos solo los valores que queremos
	const { __v, estado, ...categoria } = this.toObject();
	return categoria;
};

const Categoria = model('Categoria', categoriaSchema);

export {
	Categoria
} 