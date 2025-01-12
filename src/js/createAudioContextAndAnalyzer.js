import { currentAudio } from "./handle.js";

export let audioContext = null; // INICIALIZAMOS LA VARIABLE AUDIOCONTEXT COMO NULL
export let analyser = null; // INICIALIZAMOS LA VARIABLE ANALYZER COMO NULL
const createAudioContextAndAnalyser = (LINE_X_SINGLE_AUDIO) => {
  // SI YA HAY UN AUDIO REPRODUCIÉNDOSE, PAUSAMOS EL ACTUAL
  if (currentAudio && !currentAudio.paused) {
    LINE_X_SINGLE_AUDIO.classList.remove("linea-horizontal--recording");
    currentAudio.pause();
    audioContext = null;
  }

  if (!audioContext) {
    audioContext = new window.AudioContext(); // CREAMOS EL CONTEXTO DE AUDIO
    analyser = audioContext.createAnalyser(); // CREAMOS EL NODO DE ANALISIS DE AUDIO
    audioContext.resume(); // DESPUES DEL CLICK DEL USUARIO
  }
};

export default createAudioContextAndAnalyser;
