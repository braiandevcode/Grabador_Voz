import createAudioContextAndAnalyser, { analyser, audioContext, } from "./createAudioContextAndAnalyzer.js";
import createFrequencyBars from "./createFrequencyBars.js";
import { createBtnPlay } from "./createIconBtn.js";
import updateFrequencyBars from "./updateFrecuencyBars.js";

const D = document;
let isAudioPlaying = false;
export let currentAudio=null;
export const handleAudioPlay =(PARENT, HASH_AUDIO, LINE_X, LINE_X_SINGLE_AUDIO, BORDER_SINGLE_AUDIO, dataArray, db) => {
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

      createAudioContextAndAnalyser(LINE_X_SINGLE_AUDIO);

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
        LINE_X_SINGLE_AUDIO.classList.remove("line-x--recording");
        BORDER_SINGLE_AUDIO.classList.remove("box-audio__interaction--recording");
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

export const handleAudioPause = (PARENT) => {
  if (currentAudio) {
    currentAudio.pause();
    createBtnPlay(PARENT); // CAMBIAMOS A BOTÓN DE PLAY EN LA UI
    isAudioPlaying = false;
  }
};
