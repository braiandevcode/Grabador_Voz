import eventClick from "./js/eventClick.js";
import eventTouched from "./js/eventTouched.js";
import isMobileOrTablet from "./js/verifiUserAgent.js";
const D = document;
const LINE_X = D.querySelector(".linea-horizontal");
const db = []; // SIMULADOR BASE DE DATOS
const app = ()=> {
    !isMobileOrTablet() ? eventClick(LINE_X, db) : eventTouched(LINE_X, db);
}

export default app;