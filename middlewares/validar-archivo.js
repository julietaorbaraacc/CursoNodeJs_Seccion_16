//Chequear que haya un archivo seleccionado, si no se retorna un error
const validarArchivoSubir = (req, res, next) => {
	if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res.status(400).send('No hay archivos seleccionados para subir');
	}

	next();
}

export {
	validarArchivoSubir
}