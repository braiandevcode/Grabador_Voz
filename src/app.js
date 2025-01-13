import eventClick from "./js/eventClick.js";
import { stopRecorder } from "./js/recorder.js";
const db = [];

const LINE_X = document.querySelector(".line-x");

// EVENTO TOUCHED A SEGUIR REVISANDO
const eventTouched = (LINE_X, db) => {
    let touchInProgress = false; // Bandera para saber si el toque está en progreso
    let touchStartTime = null; // Variable para almacenar el momento del inicio del toque
    
    // Evento touchstart (cuando el usuario toca la pantalla)
    document.addEventListener("touchstart", async (e) => {
        const PARENT = e.target.parentElement; // Padre del elemento al cual se hace el evento
        if (!PARENT) return;

        // Iniciar la grabación solo si se toca el ícono del micrófono
      if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action")) {
        if (e.target.classList.contains("bi-mic-mute") && !touchInProgress) {
          touchInProgress = true; // Marcar que el toque ha comenzado
          touchStartTime = Date.now(); // Registrar el momento en que comenzó el toque
        }
      }
    });
    
    // Evento touchend (cuando el usuario deja de tocar)
    document.addEventListener("touchend", async (e) => {
      const PARENT = e.target.parentElement;
      if (!PARENT) return;

      // Calcular el tiempo de duración del toque
      const touchEndTime = Date.now();
      const touchDuration = (touchEndTime - touchStartTime) / 1000; // Duración en segundos
      
       // Si la duración del toque es menor a 2 segundos, no hacer nada
       if (touchDuration < 2) {
           console.log("El toque fue demasiado corto para grabar.");
           touchInProgress = false; // Marcar que el toque terminó
        }
    
        // Detener la grabación si se mantuvo el toque por más de 2 segundos
        if (!PARENT.hasAttribute("data-audio") && PARENT.matches(".action")) {
            if (e.target.classList.contains("bi-mic") && touchInProgress) {
                touchInProgress = false; // Marcar que el toque ha terminado
                LINE_X.classList.remove("line-x--recording");
                e.target.classList.replace("bi-mic", "bi-mic-mute");
                stopRecorder(db);
            }
        }
    });
};
const app = () => {
    // PROVISORIAMENTE PARA PRUEBAS
    const userAgent = navigator.userAgent.toLowerCase();
    if(/iphone|ipod|ipad|android|blackberry|mobile|tablet/.test(userAgent)){
        eventTouched(LINE_X, db);
    }else{
        eventClick(db);
    }
};

export default app;
