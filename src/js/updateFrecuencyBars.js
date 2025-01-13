// FUNCION PARA ACTUALIZAR LAS BARRAS DE FRECUENCIA EN LA UI
const updateFrequencyBars = (parent, isAudioPlaying, analyser, dataArray) => {
    // OBTENER LAS BARRAS DE LA UI REFERENTE AL HERMANO ANTERIOR DEL ELEMENTO PADRE
    const bars = parent.querySelectorAll(".frequency-bar");
    if (!isAudioPlaying) return; // DETENEMOS LA ACTUALIZACIÓN SI EL AUDIO NO ESTÁ REPRODUCIÉNDOSE
  
    analyser.getByteFrequencyData(dataArray); // OBTENEMOS LOS DATOS DE FRECUENCIA
  
    // REINICIAR LA ALTURA DE LAS BARRAS A 0 ANTES DE EMPEZAR A ANIMAR
    bars.forEach((bar) => {
      bar.style.height = `0px`; // ESTABLECER LA ALTURA A 0 PARA INICIAR
    });
  
    // USAMOS LOS DATOS DE FRECUENCIA PARA ANIMAR LAS BARRAS
    bars.forEach((bar, index) => {
      // LA ALTURA DE CADA BARRA SE BASA EN EL VALOR DE LA FRECUENCIA
      const height = dataArray[index]; // OBTENEMOS LA AMPLITUD DE LA FRECUENCIA EN EL ÍNDICE
      bar.style.height = `${height}px`; // MODIFICAMOS LA ALTURA DE LA BARRA
    });
  
    // LLAMAR A ESTA FUNCIÓN REPETIDAMENTE USANDO requestAnimationFrame
    requestAnimationFrame(() =>
      updateFrequencyBars(parent, isAudioPlaying, analyser, dataArray)
    ); // MANTENEMOS EL ANÁLISIS EN UN BUCLE
  };
  
  export default updateFrequencyBars;
  