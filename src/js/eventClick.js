import { createBtnPause, createBtnPlay } from "./createIconBtn.js";
import { startRecorder, stopRecorder } from "./recorder.js";

const D = document;
const db = []; // SIMULADOR BASE DE DATOS
let currentAudio = null; // VARIABLE PARA ALMACENAR AUDIO QUE SE REPRODUCE
let audioContext = null; // INICIALIZAMOS LA VARIABLE AUDIOCONTEXT COMO NULL
let analyser = null; // INICIALIZAMOS LA VARIABLE ANALYZER COMO NULL
let dataArray = null; // PARA ALMACENAR LOS DATOS DE FRECUENCIA
let isAudioPlaying = false;

const LINE_X = D.querySelector(".linea-horizontal");
const eventClick = () => {
  D.addEventListener("click", async (e) => {
    const PARENT = e.target.parentElement; // PADRE DEL ELEMENTO AL CUAL SE HACE EL EVENTO
    if (!PARENT) return; // AÑADIMOS ESTA LÍNEA PARA EVITAR ERRORES

    // INICIAR O REANUDAR EL AUDIOCONTEXT AL PRIMER CLIC DEL USUARIO
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)(); // CREAMOS EL CONTEXTO DE AUDIO
      analyser = audioContext.createAnalyser(); // CREAMOS EL NODO DE ANALISIS DE AUDIO
      // DESPUES DEL CLICK DEL USUARIO
      audioContext.resume();
    }

    // PRIMER PASO: GRABAR AUDIO
    if (
      !PARENT.hasAttribute("data-audio") &&
      PARENT.matches(".action-play-pause")
    ) {
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
    if (PARENT.hasAttribute("data-audio") &&PARENT.matches(".action-play-pause")) {
      const HASH_AUDIO = PARENT.dataset.audio;

      if (e.target.classList.contains("action-play-pause__play")) {
        createBtnPause(PARENT); // CAMBIAR A BOTÓN DE PAUSA EN LA UI

        const FRECUENCY_BARS =PARENT.previousElementSibling.querySelector(".frequency-bars");
        const margin = 1; // MARGEN DE LAS BARRAS EN PIXELES
        const containerWidth = LINE_X.offsetWidth; //ANCHO DISPONIBLE DEL CONTENEDOR
        const minBarWidth = 1; // MINIMO ANCHO DE BARRA

        // CALCULAR CUANTAS BARRAS CABEN EN EL CONTENEDOR CON EL MARGEN DADO
        const numBars = Math.floor(containerWidth / (minBarWidth + margin)); // Número de barras que caben

        //EL ANCHO DE CADA BARRA DEBE SER AJUSTADO SEGUN EL NUMERO DE BARRAS
        const barWidth = (containerWidth - margin * (numBars - 1)) / numBars;

        // LIMPIAR CONTENEDOR DE BARRAS ANTES DE CREAR
        FRECUENCY_BARS.innerHTML = "";

        //RECORRER UN FOR REFERENTE A LA CANTIDAD DE BARRAS CALCULADAS
        for (let i = 0; i < numBars; i++) {
          const bar = document.createElement("div");
          bar.classList.add("frequency-bar"); // Asignamos una clase para dar estilo con CSS
          bar.style.width = `${barWidth}px`; // Ancho de cada barra
          bar.style.marginRight = `${margin}px`; // Establecer el margen entre las barras

          FRECUENCY_BARS.append(bar); // Agregar la barra al contenedor
        }

        if (db.length > 0) {
          const INDEX_DATA = db.findIndex(({ id }) => id === HASH_AUDIO);
          if (INDEX_DATA !== -1) {
            PARENT.previousElementSibling.querySelector(".linea-horizontal").classList.add("linea-horizontal--recording");
            // SI YA HAY UN AUDIO REPRODUCIÉNDOSE, PAUSAMOS EL ACTUAL
            if (currentAudio && !currentAudio.paused) {
              currentAudio.pause();
            }

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

              currentAudio.play();
              isAudioPlaying = true; // ESTABLECER EL FLAG A TRUE CUANDO EL AUDIO ESTA REPRODUCIÉNDOSE
            

            // FUNCION PARA ACTUALIZAR LAS BARRAS DE FRECUENCIA EN LA UI
            function updateFrequencyBars() {
              if (!isAudioPlaying) return; // DETENEMOS LA ACTUALIZACIÓN SI EL AUDIO NO ESTÁ REPRODUCIÉNDOSE

              analyser.getByteFrequencyData(dataArray); // OBTENEMOS LOS DATOS DE FRECUENCIA

              // OBTENER LAS BARRAS DE LA UI REFERENTE AL HERMANO ANTERIOR DEL ELEMENTO PADRE
              const bars = PARENT.previousElementSibling.querySelectorAll(".frequency-bar");

              // USAMOS LOS DATOS DE FRECUENCIA PARA ANIMAR LAS BARRAS
              bars.forEach((bar, index) => {
                // LA ALTURA DE CADA BARRA SE BASA EN EL VALOR DE LA FRECUENCIA
                const height = dataArray[index] || 0; // OBTENEMOS LA AMPLITUD DE LA FRECUENCIA EN EL ÍNDICE
                bar.style.height = `${height}px`; // MODIFICAMOS LA ALTURA DE LA BARRA
              });

              // LLAMAR A ESTA FUNCIÓN REPETIDAMENTE USANDO requestAnimationFrame
              requestAnimationFrame(updateFrequencyBars); // MANTENEMOS EL ANÁLISIS EN UN BUCLE
            }

            updateFrequencyBars();

            // DETECTAR CUANDO TERMINA LA REPRODUCCIÓN
            currentAudio.addEventListener("ended", () => {
              createBtnPlay(PARENT);
              db[INDEX_DATA].currentTime = 0; // RESETEAMOS EL TIEMPO EN LA DB
              isAudioPlaying = false;
              PARENT.previousElementSibling.querySelector(".linea-horizontal").classList.remove("linea-horizontal--recording");
              FRECUENCY_BARS.innerHTML = "";
            });

            // DETECTAR CUANDO SE PAUSA LA REPRODUCCIÓN
            currentAudio.addEventListener("pause", () => {
              db[INDEX_DATA].currentTime = currentAudio.currentTime; // GUARDAMOS EL TIEMPO ACTUAL EN DB
              isAudioPlaying = false;
              createBtnPlay(PARENT);
              FRECUENCY_BARS.innerHTML = "";
            });
          }
        }
      }

        // SI EL TARGET TIENE LA CLASE DE PAUSA
        if (e.target.classList.contains("action-play-pause__pause")) {
          if (currentAudio) {
            currentAudio.pause();
            createBtnPlay(PARENT); // CAMBIAMOS A BOTÓN DE PLAY EN LA UI
            isAudioPlaying = false;
          }
        }
    }
  });
};

export default eventClick;
