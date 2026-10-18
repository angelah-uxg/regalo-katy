
document.addEventListener("DOMContentLoaded", () => {
  const bienvenida = document.getElementById("bienvenida");
  const abrirRegalo = document.getElementById("abrirRegalo");
  const contenido = document.getElementById("contenido");

  const musica = document.getElementById("musica");
  const botonMusica = document.getElementById("botonMusica");
  const barraProgreso = document.getElementById("barraProgreso");
  const tiempoActual = document.getElementById("tiempoActual");
  const duracionTotal = document.getElementById("duracionTotal");

  const botonSorpresa = document.getElementById("mostrarSorpresa");
  const sorpresaFinal = document.getElementById("sorpresaFinal");

  function mostrarTiempo(segundos) {
    if (!Number.isFinite(segundos)) return "0:00";

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    return `${minutos}:${String(segundosRestantes).padStart(2, "0")}`;
  }

  function actualizarBotonMusica() {
    if (!musica || !botonMusica) return;

    botonMusica.textContent = musica.paused ? "▶" : "❚❚";
    botonMusica.setAttribute(
      "aria-label",
      musica.paused ? "Reproducir música" : "Pausar música"
    );
  }

  async function reproducirMusica() {
    if (!musica) return;

    try {
      await musica.play();
    } catch (error) {
      console.error("No se pudo reproducir la canción:", error);
      alert(
        "No se pudo reproducir la canción. Comprueba que el archivo " +
        "musica/Te Quiero.mp3 esté subido correctamente."
      );
    }

    actualizarBotonMusica();
  }

  if (musica) {
    musica.addEventListener("play", actualizarBotonMusica);
    musica.addEventListener("pause", actualizarBotonMusica);

    musica.addEventListener("loadedmetadata", () => {
      if (duracionTotal) {
        duracionTotal.textContent = mostrarTiempo(musica.duration);
      }
    });

    musica.addEventListener("timeupdate", () => {
      if (tiempoActual) {
        tiempoActual.textContent = mostrarTiempo(musica.currentTime);
      }

      if (
        barraProgreso &&
        Number.isFinite(musica.duration) &&
        musica.duration > 0
      ) {
        barraProgreso.value =
          (musica.currentTime / musica.duration) * 100;
      }
    });

    musica.addEventListener("error", () => {
      console.error(
        "Error de audio. Revisa la ruta: musica/Te Quiero.mp3",
        musica.error
      );
    });
  }

  if (abrirRegalo) {
    abrirRegalo.addEventListener("click", async () => {
      if (bienvenida) bienvenida.classList.add("hidden");
      if (contenido) contenido.classList.add("visible");

      await reproducirMusica();
    });
  }

  if (botonMusica && musica) {
    botonMusica.addEventListener("click", async () => {
      if (musica.paused) {
        await reproducirMusica();
      } else {
        musica.pause();
      }
    });
  }

  if (barraProgreso && musica) {
    barraProgreso.addEventListener("input", () => {
      if (Number.isFinite(musica.duration) && musica.duration > 0) {
        musica.currentTime =
          (Number(barraProgreso.value) / 100) * musica.duration;
      }
    });
  }

  if (botonSorpresa && sorpresaFinal) {
    botonSorpresa.addEventListener("click", () => {
      sorpresaFinal.hidden = false;
      botonSorpresa.hidden = true;
      sorpresaFinal.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  // Corazones flotantes decorativos
  function crearCorazon() {
    const corazon = document.createElement("span");

    corazon.className = "floating-heart";
    corazon.textContent = Math.random() > 0.5 ? "💜" : "♡";

    corazon.style.left = `${Math.random() * 100}%`;
    corazon.style.animationDuration = `${4 + Math.random() * 5}s`;
    corazon.style.fontSize = `${12 + Math.random() * 18}px`;

    document.body.appendChild(corazon);

    setTimeout(() => corazon.remove(), 9000);
  }

  setInterval(crearCorazon, 1200);

  actualizarBotonMusica();
});
