import { createBtnPause, createBtnPlay } from "./createIconBtn.js";
import { startRecorder, stopRecorder } from "./recorder.js";
import updateFrequencyBars from "./updateFrecuencyBars.js";

const D = document;
const db = []; // SIMULADOR BASE DE DATOS
let currentAudio = null; // VARIABLE PARA ALMACENAR AUDIO QUE SE REPRODUCE
let audioContext = null; // INICIALIZAMOS LA VARIABLE AUDIOCONTEXT COMO NULL
let analyser = null; // INICIALIZAMOS LA VARIABLE ANALYZER COMO NULL
let dataArray = null; // PARA ALMACENAR LOS DATOS DE FRECUENCIA
let isAudioPlaying = false;
const LINE_X = D.querySelector(".linea-horizontal");

const createAudioContextAndAnalyser = () => {
  if (!audioContext) {
    audioContext = new window.AudioContext(); // CREAMOS EL CONTEXTO DE AUDIO
    analyser = audioContext.createAnalyser(); // CREAMOS EL NODO DE ANALISIS DE AUDIO
    audioContext.resume(); // DESPUES DEL CLICK DEL USUARIO
  }
};

const createFrequencyBars = (container, numBars, barWidth, margin) => {
  container.innerHTML = ""; // LIMPIAMOS LAS BARRAS ANTERIORES
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement("div");
    bar.classList.add("frequency-bar");
    bar.style.width = `${barWidth}px`;
    bar.style.marginRight = `${margin}px`;
    container.append(bar);
  }
};

const handleAudioPlay = (PARENT, HASH_AUDIO, LINE_X_SINGLE_AUDIO, e) => {
  const FRECUENCY_BARS = D.querySelector(`[data-freq="${HASH_AUDIO}"]`);

  // LIMPIAR BARRAS ANTES DE CREAR NUEVAS
  FRECUENCY_BARS.innerHTML = ""; // LIMPIAMOS LAS BARRAS ANTERIORES

  const margin = 1; // MARGEN DE LAS BARRAS EN PIXELES
  const containerWidth = LINE_X.offsetWidth; // ANCHO DISPONIBLE DEL CONTENEDOR
  const minBarWidth = 1; // MINIMO ANCHO DE BARRA

  // CALCULAR CUANTAS BARRAS CABEN EN EL CONTENEDOR CON EL MARGEN DADO
  const numBars = Math.floor(containerWidth / (minBarWidth + margin)); // Número de barras que caben

  // EL ANCHO DE CADA BARRA DEBE SER AJUSTADO SEGUN EL NUMERO DE BARRAS
  const barWidth = (containerWidth - margin * (numBars - 1)) / numBars;

  createFrequencyBars(FRECUENCY_BARS, numBars, barWidth, margin);

  if (db.length > 0) {
    const INDEX_DATA = db.findIndex(({ id }) => id === HASH_AUDIO);
    if (INDEX_DATA !== -1) {
      // SI YA HAY UN AUDIO REPRODUCIÉNDOSE, PAUSAMOS EL ACTUAL
      if (currentAudio && !currentAudio.paused) {
        LINE_X_SINGLE_AUDIO.classList.remove("linea-horizontal--recording");
        currentAudio.pause();
        audioContext = null;
      }

      createAudioContextAndAnalyser();

      // CREAR UN NUEVO ELEMENTO DE AUDIO
      currentAudio = D.createElement("audio");
      currentAudio.src = db[INDEX_DATA].audio; // SUPONIENDO QUE db[INDEX_DATA].audio ES UN BLOB URL
      currentAudio.controls = true;

      // CREAR UN SOURCE NODE PARA ANALIZAR EL AUDIO
      const source = audioContext.createMediaElementSource(currentAudio);
      source.connect(analyser); // CONECTAMOS EL SOURCE AL ANALYZER
      analyser.connect(audioContext.destination); // CONECTAMOS EL ANALYZER A LA SALIDA DE AUDIO

      // OBTENEMOS EL TAMAÑO DEL BUFFER PARA EL ANALYZER
      dataArray = new Uint8Array(analyser.frequencyBinCount); // INICIALIZAMOS EL ARRAY DE DATOS DE FRECUENCIA

      isAudioPlaying = true; // ESTABLECER EL FLAG A TRUE CUANDO EL AUDIO ESTA REPRODUCIÉNDOSE

      updateFrequencyBars(FRECUENCY_BARS, isAudioPlaying, analyser, dataArray);

      currentAudio.currentTime = db[INDEX_DATA].currentTime;
      currentAudio.play();

      // DETECTAR CUANDO TERMINA LA REPRODUCCIÓN
      currentAudio.addEventListener("ended", () => {
        createBtnPlay(PARENT);
        db[INDEX_DATA].currentTime = 0; // RESETEAMOS EL TIEMPO EN LA DB
        isAudioPlaying = false;
        LINE_X_SINGLE_AUDIO.classList.remove("linea-horizontal--recording");
        FRECUENCY_BARS.innerHTML = ""; // LIMPIAR BARRAS AL TERMINAR EL AUDIO
      });

      // DETECTAR CUANDO SE PAUSA LA REPRODUCCIÓN
      currentAudio.addEventListener("pause", () => {
        // LIMPIAR CONTENEDOR DE BARRAS ANTES DE CREAR
        FRECUENCY_BARS.innerHTML = "";
        db[INDEX_DATA].currentTime = currentAudio.currentTime; // GUARDAMOS EL TIEMPO ACTUAL EN DB
        isAudioPlaying = false;
        createBtnPlay(PARENT);
      });
    }
  }
};

const handleAudioPause = (PARENT) => {
  if (currentAudio) {
    currentAudio.pause();
    createBtnPlay(PARENT); // CAMBIAMOS A BOTÓN DE PLAY EN LA UI
    isAudioPlaying = false;
  }
};

const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|ipad|android|blackberry|mobile|tablet/.test(userAgent);
};

const eventClick = () => {
  // Solo ejecutamos click si NO es móvil o tablet
  if (!isMobileOrTablet()) {
    D.addEventListener("click", async (e) => {
      const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
      if (!PARENT) return; // AÑADIMOS ESTA LÍNEA PARA EVITAR ERRORES

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
          createBtnPause(PARENT); // CAMBIAR A BOTÓN DE PAUSA EN LA UI
          handleAudioPlay(PARENT, HASH_AUDIO, LINE_X_SINGLE_AUDIO, e);
        }

        // SI EL TARGET TIENE LA CLASE DE PAUSA
        if (e.target.classList.contains("action-play-pause__pause")) {
          handleAudioPause(PARENT);
        }
      }
    });
  }

  // LÓGICA PARA GRABACIÓN EN MÓVILES Y TABLETS (TOUCH)
  if (isMobileOrTablet()) {
    D.addEventListener("touchstart", async (e) => {
      const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
      if (!PARENT) return;

      // INICIAR GRABACIÓN SOLO SI SE TOCA EL ICONO DEL MICRÓFONO
      if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
        if (e.target.classList.contains("bi-mic-mute")) {
          await startRecorder();
          LINE_X.classList.add("linea-horizontal--recording");
          e.target.classList.replace("bi-mic-mute", "bi-mic");
        }
      }
    });

    D.addEventListener("touchend", (e) => {
      const PARENT = e.target.parentElement;
      if (!PARENT) return;

      // DETENER GRABACIÓN AL SOLTAR EL TOUCH
      if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action-play-pause")) {
        if (e.target.classList.contains("bi-mic")) {
          LINE_X.classList.remove("linea-horizontal--recording");
          e.target.classList.replace("bi-mic", "bi-mic-mute");
          stopRecorder(db);
        }
      }
    });
  }
};

export default eventClick;
