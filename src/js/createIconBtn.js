const D=document;
// CREACION DE BOTON PLAY
export const createBtnPlay = (parent) => {
  const PLAY = D.createElement("DIV"); // CREAMOS ELEMENTO DIV
  PLAY.classList.add("action__play"); // AÑADIMOS SU CLASE PLAY
  parent.innerHTML = "";
  parent.append(PLAY); // AGREGAMOS NUEVO HIJO DE PLAY
  return PLAY;
};

// CREACION DE BOTON PAUSE
export const createBtnPause = (parent) => {
  const PAUSE = D.createElement("DIV"); // CREAMOS ELEMENTO DIV
  PAUSE.classList.add("action__pause"); // AÑADIMOS SU CLASE PAUSE
  parent.innerHTML = "";
  parent.append(PAUSE); // AGREGAMOS NUEVO HIJO DE PAUSA
  return PAUSE;
};
