const D = document;
const recorderContainer = D.querySelector(".grabaciones-container"); // CONTENEDOR DE GRABACIONES
// FUNCION PARA GUARDAR EL AUDIO EN ARRAY
const saveDataAudio = (db, id, audio, currentTime = 0) => {
  db.push({ id, audio, currentTime }); // AHORA GUARDAMOS EL currentTime
};

// CREAR CAJA PERSONALIZADA DE NUEVO AUDIO
const createNewBoxAudio = (db, id, audio, currentTime = 0) => {
  const FRAGMENT = D.createDocumentFragment(); // CREAR FRAGMENT
  saveDataAudio(db, id, audio, currentTime); // GUARDAMOS DATOS DEL AUDIO Y EL currentTime

  const NEW_BOX = D.createElement("div"); // NUEVA CAJA DE AUDIO
  NEW_BOX.classList.add("caja-audio", "d-flex", "ai-center", "jc-center"); // AÑADIR CLASE "caja-audio"

  // CONTENIDO DE LA NUEVA CAJA
  const CLONE_BOX_AUDIO = D.createElement("DIV");
  CLONE_BOX_AUDIO.classList.add(
    "caja-audio__interaccion",
    "d-flex",
    "ai-center",
    "jc-evenly"
  );

  const CLONE_BOX_AUDIO_SONIDO = D.createElement("DIV");
  CLONE_BOX_AUDIO_SONIDO.classList.add(
    "caja-audio__sonido",
    "d-flex",
    "ai-center",
    "jc-center"
  );
  const CLONE_LINE_X = D.createElement("DIV");
  CLONE_LINE_X.classList.add(
    "d-flex",
    "ai-center",
    "jc-center",
    "linea-horizontal"
  );

  const FRECUENCY_BARS = D.createElement("DIV");
  FRECUENCY_BARS.classList.add("frequency-bars");
  FRECUENCY_BARS.setAttribute("data-freq", id)

  CLONE_LINE_X.append(FRECUENCY_BARS);

  CLONE_BOX_AUDIO_SONIDO.append(CLONE_LINE_X);

  const CLONE_BOX_AUDIO_ACTIONS = D.createElement("DIV");
  CLONE_BOX_AUDIO_ACTIONS.classList.add("action-play-pause");
  CLONE_BOX_AUDIO_ACTIONS.setAttribute("data-audio", id);

  const CLON_PLAY_PAUSE = D.createElement("DIV");
  CLON_PLAY_PAUSE.classList.add("action-play-pause__play");

  CLONE_BOX_AUDIO_ACTIONS.append(CLON_PLAY_PAUSE);

  CLONE_BOX_AUDIO.append(CLONE_BOX_AUDIO_SONIDO);
  CLONE_BOX_AUDIO.append(CLONE_BOX_AUDIO_ACTIONS);

  NEW_BOX.append(CLONE_BOX_AUDIO);

  FRAGMENT.append(NEW_BOX);

  recorderContainer.appendChild(FRAGMENT); // AÑADIR FRAGMENT AL CONTENEDOR
};

export default createNewBoxAudio;
