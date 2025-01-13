import { createBtnPause } from "./createIconBtn.js";
import { handleAudioPause, handleAudioPlay } from "./handle.js";
import { startRecorder, stopRecorder } from "./recorder.js";

const D = document;
let dataArray = null; // PARA ALMACENAR LOS DATOS DE FRECUENCIA

const LINE_X = D.querySelector(".line-x");
const eventClick = (db) => {
  D.addEventListener("click", async (e) => {
    const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
    const LINE_X_SINGLE_AUDIO = PARENT.previousElementSibling.querySelector(".line-x");
    const BORDER_SINGLE_AUDIO = PARENT.parentElement;
    if (!PARENT) return; // AÑADIMOS ESTA LÍNEA PARA EVITAR ERRORES


    // PRIMER PASO: GRABAR AUDIO
    if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action")) {
      if (e.target.classList.contains("bi-mic-mute")) {
        await startRecorder();
        LINE_X.classList.add("line-x--recording");
        BORDER_SINGLE_AUDIO.classList.add("box-audio__interaction--recording");
        e.target.classList.replace("bi-mic-mute", "bi-mic");
      } else {
        e.target.classList.replace("bi-mic", "bi-mic-mute");
        LINE_X.classList.remove("line-x--recording");
        BORDER_SINGLE_AUDIO.classList.remove("box-audio__interaction--recording");

        stopRecorder(db);
      }
    }

    // SEGUNDO PASO: REPRODUCIR AUDIO Y VISUALIZAR FRECUENCIA
    if (PARENT.hasAttribute("data-audio") && PARENT.matches(".action")) {
      const HASH_AUDIO = PARENT.dataset.audio;

      if (e.target.classList.contains("action__play")) {
        LINE_X_SINGLE_AUDIO.classList.add("line-x--recording");
        BORDER_SINGLE_AUDIO.classList.add("box-audio__interaction--recording");

        createBtnPause(PARENT); // CAMBIAR A BOTÓN DE PAUSA EN LA UI
        handleAudioPlay(PARENT, HASH_AUDIO, LINE_X, LINE_X_SINGLE_AUDIO, BORDER_SINGLE_AUDIO,  dataArray, db)
      }

      // SI EL TARGET TIENE LA CLASE DE PAUSA
      if (e.target.classList.contains("action__pause")) {
        handleAudioPause(PARENT)
      }
    }
  });
};

export default eventClick;
