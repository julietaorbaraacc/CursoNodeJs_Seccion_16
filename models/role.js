//Externo
import { Schema, model } from "mongoose";

//Definimos que va a contener el rol
const roleSchema = Schema({
	role: {
		type: String,
		required: [true, "El rol es obligatorio"]
	}
});

const Role = model('Role', roleSchema);

export {
	Role
} 