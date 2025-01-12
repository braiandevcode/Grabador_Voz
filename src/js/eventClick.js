import { createBtnPause, createBtnPlay } from "./createIconBtn.js";
import { handleAudioPause, handleAudioPlay } from "./handle.js";
import { startRecorder, stopRecorder } from "./recorder.js";

const D = document;
let dataArray = null; // PARA ALMACENAR LOS DATOS DE FRECUENCIA

const eventClick = (LINE_X, db) => {
  D.addEventListener("click", async (e) => {
    const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
    if (!PARENT) return; // ANADIMOS ESTA LINEA PARA EVITAR ERRORES

    // PRIMER PASO: GRABAR AUDIO (ESCRITORIO)
    if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
      if (e.target.classList.contains("bi-mic-mute")) {
        await startRecorder();
        LINE_X.classList.add("linea-horizontal--recording");
        e.target.classList.replace("bi-mic-mute", "bi-mic");
      } else {
        e.target.classList.replace("bi-mic", "bi-mic-mute");
        LINE_X.classList.remove("linea-horizontal--recording");
        stopRecorder(db);
      }
    }

    // SEGUNDO PASO: REPRODUCIR AUDIO Y VISUALIZAR FRECUENCIA
    if (PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
      const HASH_AUDIO = PARENT.dataset.audio;
      const PREVIOUS_ELEMENT = PARENT.previousElementSibling;
      const LINE_X_SINGLE_AUDIO = PREVIOUS_ELEMENT.querySelector(".linea-horizontal");

      if (e.target.classList.contains("action-play-pause__play")) {
        LINE_X_SINGLE_AUDIO.classList.add("linea-horizontal--recording");
        createBtnPause(PARENT); // CAMBIAR A BOTON DE PAUSA EN LA UI
        handleAudioPlay(
          PARENT,
          HASH_AUDIO,
          LINE_X,
          LINE_X_SINGLE_AUDIO,
          dataArray,
          db
        );
      }

      // SI EL TARGET TIENE LA CLASE DE PAUSA
      if (e.target.classList.contains("action-play-pause__pause")) {
        handleAudioPause(PARENT);
      }
    }
  });
};
export default eventClick;
