//Externo
import { Router } from 'express';
import { check } from 'express-validator';
import { buscar } from '../controllers/index.js';

const routerSearch = Router();

routerSearch.get("/:coleccion/:termino", buscar);

export {
	routerSearch
}