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

export default createFrequencyBars;
