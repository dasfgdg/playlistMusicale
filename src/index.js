/**
 * @typedef {Object} Track
 * @property {number} id - Identificativo univoco generato automaticamente
 * @property {string} title - Titolo del brano
 * @property {string} artist - Artista del brano
 * @property {number} duration - Durata in secondi
 * @property {boolean} favorite - Indica se il brano è tra i preferiti
 */

const playlist = [];

let nextId = 1;

/**
 * Aggiunge un nuovo brano alla playlist.
 * @param {string} title - Titolo del brano
 * @param {string} artist - Nome dell'artista
 * @param {number} duration - Durata in secondi
 * @returns {Track} Il brano appena creato
 */
function addTrack(title, artist, duration) {
  const track = {
    id: nextId++,
    title,
    artist,
    duration,
    favorite: false,
  };
  playlist.push(track);
  render();
  return track;
}

/**
 * Rimuove un brano dalla playlist tramite ID o titolo.
 * @param {number|string} identifier - ID numerico oppure titolo del brano
 * @returns {boolean} true se rimosso, false se non trovato
 */
function removeTrack(identifier) {
  const index = playlist.findIndex(
    (t) => t.id === identifier || t.title === identifier,
  );
  if (index === -1) return false;
  playlist.splice(index, 1);
  render();
  return true;
}

/**
 * Avvia la riproduzione simulata mostrando i brani in sequenza.
 * @returns {void}
 */
function play() {
  if (playlist.length === 0) {
    console.log("Playlist vuota");
    return;
  }
  console.log("--- Riproduzione ---");
  playlist.forEach((t, i) => {
    console.log(
      `${i + 1}. ${t.title} - ${t.artist} (${formatDuration(t.duration)})`,
    );
  });
}

/**
 * Inverte lo stato di "preferito" di un brano.
 * @param {number} id - ID del brano
 * @returns {boolean} true se aggiornato, false se non trovato
 */
function toggleFavorite(id) {
  const track = playlist.find((t) => t.id === id);
  if (!track) return false;
  track.favorite = !track.favorite;
  render();
  return true;
}

/**
 * Calcola la durata totale della playlist.
 * @returns {number} Durata complessiva in secondi
 */
function totalDuration() {
  return playlist.reduce((sum, t) => sum + t.duration, 0);
}

/**
 * Sposta un brano in una nuova posizione della playlist.
 * @param {number} fromIndex - Posizione attuale (0-based)
 * @param {number} toIndex - Posizione di destinazione (0-based)
 * @returns {boolean} true se spostato, false se indici non validi
 */
function moveTrack(fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= playlist.length) return false;
  if (toIndex < 0 || toIndex >= playlist.length) return false;
  const [track] = playlist.splice(fromIndex, 1);
  playlist.splice(toIndex, 0, track);
  render();
  return true;
}

/**
 * Converte una durata in secondi nel formato mm:ss.
 * @param {number} seconds - Durata in secondi
 * @returns {string} Durata formattata
 */
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Aggiorna la visualizzazione della playlist nel DOM.
 * @returns {void}
 */
function render() {
  const list = document.getElementById("playlist");
  const total = document.getElementById("total");

  list.innerHTML = "";
  playlist.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = `${t.favorite ? "★ " : ""}${t.title} - ${t.artist} (${formatDuration(t.duration)})`;

    const fav = document.createElement("button");
    fav.textContent = "fav";
    fav.onclick = () => toggleFavorite(t.id);

    const del = document.createElement("button");
    del.textContent = "x";
    del.onclick = () => removeTrack(t.id);

    const up = document.createElement("button");
    up.textContent = "↑";
    up.onclick = () => moveTrack(i, i - 1);

    li.append(" ", fav, del, up);
    list.appendChild(li);
  });

  total.textContent = formatDuration(totalDuration());
}

/**
 * Gestisce il submit del form per aggiungere un brano.
 * @param {Event} e - Evento submit del form
 * @returns {void}
 */
function handleSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const artist = document.getElementById("artist").value;
  const duration = parseInt(document.getElementById("duration").value, 10);
  addTrack(title, artist, duration);
  e.target.reset();
}

document.getElementById("track-form").addEventListener("submit", handleSubmit);
document.getElementById("play-btn").addEventListener("click", play);
