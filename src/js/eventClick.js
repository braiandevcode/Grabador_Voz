const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|ipad|android|blackberry|mobile|tablet/.test(userAgent);
};

const eventClick = () => {
  // SOLO EJECUTAMOS CLICK SI NO ES MOVIL O TABLET
  if (!isMobileOrTablet()) {
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
          handleAudioPlay(PARENT, HASH_AUDIO, LINE_X_SINGLE_AUDIO, e);
        }

        // SI EL TARGET TIENE LA CLASE DE PAUSA
        if (e.target.classList.contains("action-play-pause__pause")) {
          handleAudioPause(PARENT);
        }
      }
    });
  }

  // LOGICA PARA GRABACION EN MOVILES Y TABLETS (TOUCH)
  if (isMobileOrTablet()) {
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

      // EVITAR QUE SE DISPIRE UN CLICK ADICIONAL CUANDO TOQUE ES DETECTADO
      e.preventDefault();
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

      // EVITAR QUE SE DISPIRE UN CLICK ADICIONAL CUANDO TOQUE ES DETECTADO
      e.preventDefault();
    });
  }
};
