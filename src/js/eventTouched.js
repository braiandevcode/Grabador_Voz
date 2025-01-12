import { createBtnPause } from "./createIconBtn.js";
import { handleAudioPause, handleAudioPlay } from "./handle.js";
import { startRecorder, stopRecorder } from "./recorder.js";

const D = document;
const eventTouched = (LINE_X, db) => {
  // LOGICA PARA GRABACION EN MOVILES Y TABLETS (TOUCH)
  let touchInProgress = false; // BANDERA PARA VERIFICAR SI EL TOUCH ESTA ACTIVO

  D.addEventListener("touchstart", async (e) => {
    const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
    if (!PARENT) return;

    // INICIAR GRABACION SOLO SI SE TOCA EL ICONO DEL MICROFONO
    if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
      if (e.target.classList.contains("bi-mic-mute") && !touchInProgress) {
        touchInProgress = true; // MARCAR QUE EL TOQUE HA COMENZADO
        await startRecorder();
        LINE_X.classList.add("linea-horizontal--recording");
        e.target.classList.replace("bi-mic-mute", "bi-mic");
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
    }

    // EVITAR QUE SE DISPIRE UN CLICK ADICIONAL CUANDO TOQUE ES DETECTADO
    if (e.cancelable){
        e.preventDefault(); // Evitar desplazamiento en la página
     }
  });

  D.addEventListener("touchend", (e) => {
    const PARENT = e.target.parentElement;
    if (!PARENT) return;

    // DETENER GRABACION AL SOLTAR EL TOUCH
    if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
      if (e.target.classList.contains("bi-mic") && touchInProgress) {
        touchInProgress = false; // MARCAR QUE EL TOQUE HA TERMINADO
        LINE_X.classList.remove("linea-horizontal--recording");
        e.target.classList.replace("bi-mic", "bi-mic-mute");
        stopRecorder(db);
      }
    }

    // SEGUNDO PASO: REPRODUCIR AUDIO Y VISUALIZAR FRECUENCIA
    if (PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
        handleAudioPause(PARENT);
    }

    // EVITAR QUE SE DISPIRE UN CLICK ADICIONAL CUANDO TOQUE ES DETECTADO
    if (e.cancelable){
        e.preventDefault(); // Evitar desplazamiento en la página
     }
  });

  // Opcionalmente, puedes añadir un evento 'touchmove' si quieres que el toque
  // se considere solo si el dedo está sobre el icono del micrófono y no se mueve
  D.addEventListener("touchmove", (e) => {
    const PARENT = e.target.parentElement;
    if (!PARENT) return;

    // Solo continua la grabación si el dedo no se ha movido fuera del área
    if (touchInProgress && !PARENT.matches(".action-play-pause")) {
      touchInProgress = false; // Detener la grabación si el dedo se mueve fuera
      LINE_X.classList.remove("linea-horizontal--recording");
      e.target.classList.replace("bi-mic", "bi-mic-mute");
      stopRecorder(db);
    }

    if (e.cancelable){
       e.preventDefault(); // Evitar desplazamiento en la página
    }
  });
};

export default eventTouched;
