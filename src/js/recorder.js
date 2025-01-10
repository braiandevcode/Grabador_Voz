import createNewBoxAudio from "./boxAudio.js";

let recorder, stream; // VARIABLES
// FUNCION QUE SE ENCARGA DE COMENZAR GRABACION
export const startRecorder = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream); // INSTANCIA DE RECORDER
    recorder.start(); // COMENZAR RECORDER
  } catch (err) {
    console.error("Error al acceder al micrófono", err);
  }
};

export const stopRecorder= (db) => {
  // PREGUNTAR ANTES DE DETENER GRABACIÓN
  if (recorder && recorder.state === "recording") {
    recorder.stop(); // DETENER RECORDER
    // EVENTO DE ESCUCHA DE RECORDER CUANDO ESTE LISTO PARA PROCESAR Y GUARDAR ESOS FRAGMENTOS DE DATOS DEL AUDIO
    recorder.addEventListener("dataavailable", async (e) => {
      const audioURL = URL.createObjectURL(new Blob([e.data])); // GUARDAR EN AUDIO EL OBJETO GENERADO EN LA GRABACIÓN
      const randomUUID = crypto.randomUUID();
      createNewBoxAudio(db,randomUUID, audioURL, 0); //CREAR  NUEVA CAJA DE AUDIO
    });
  }
};
