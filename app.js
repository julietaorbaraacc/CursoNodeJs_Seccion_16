//Importanciones de lo externo
import * as dotenv from 'dotenv';
dotenv.config();

//Importaciones de lo interno
import { Server } from './models/server.js';

//Inicializamos la clase y llamamos al listen
const server = new Server();
server.listen();