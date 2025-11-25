// CONFIG PRINCIPAL
const BASE_URL = "https://v3.football.api-sports.io";

// DOM
const tablaBody = document.getElementById("tabla-body");
const fixturesBody = document.getElementById("tabla-fixtures-body");
const tituloLiga = document.getElementById("descripcion-filtro");
const logoLiga = document.getElementById("logo-liga");
const seasonLabel = document.getElementById("season-label");

// IDs de ligas API-FOOTBALL
const ligas = {
  laliga: 140,
  laliga2: 141,
  primeraRF: 436,
  premier: 39,
  seriea: 135,
  bundes: 78,
  ligue1: 61,
  champions: 2,
  europa: 3,
  conference: 848
};


// INICIO
document.addEventListener("DOMContentLoaded", () => {
  cargarLiga("laliga");
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(btn);
    cargarLiga(btn.dataset.liga);
  });
});

function setActive(btn) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}


// LLAMADAS API
async function apiGet(endpoint, params = {}) {
  const url = new URL(BASE_URL + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": API_KEY }
  });

  return res.json();
}

// CARGAR LIGA COMPLETA
async function cargarLiga(key) {
  const leagueId = ligas[key];
  tituloLiga.textContent = "Clasificación – " + nombreBonito(key);

  logoLiga.src = `https://media.api-sports.io/football/leagues/${leagueId}.png`;

  tablaBody.innerHTML = `<tr><td colspan="7">Cargando clasificación...</td></tr>`;
  fixturesBody.innerHTML = `<tr><td colspan="6">Cargando partidos...</td></tr>`;

  const standings = await getStandings(leagueId);
  pintarClasificacion(standings);

  const fixtures = await getFixtures(leagueId);
  pintarFixtures(fixtures);
}

// STANDINGS con fallback
async function getStandings(leagueId) {
  const temporadas = [2023, 2022, 2021, 2020, 2019, 2018];

  for (let season of temporadas) {
    const data = await apiGet("/standings", { league: leagueId, season });

    if (
      data.response &&
      data.response.length > 0 &&
      data.response[0].league.standings &&
      data.response[0].league.standings.length > 0
    ) {
      seasonLabel.textContent = `Temporada ${season}`;
      return data.response[0].league.standings[0];
    }
  }

  seasonLabel.textContent = "Sin datos";
  return null;
}

// FIXTURES (next y fallback last)
async function getFixtures(leagueId) {
  let data = await apiGet("/fixtures", {
    league: leagueId,
    season: 2023,
    next: 10
  });

  if (data.response && data.response.length > 0) return data.response;

  data = await apiGet("/fixtures", {
    league: leagueId,
    season: 2023,
    last: 10
  });

  return data.response || [];
}

// PINTAR TABLAS
function pintarClasificacion(lista) {
  if (!lista) {
    tablaBody.innerHTML =
      `<tr><td colspan="7">Esta competición no tiene clasificación disponible.</td></tr>`;
    return;
  }

  tablaBody.innerHTML = "";

  lista.forEach(team => {
    tablaBody.innerHTML += `
      <tr>
        <td>${team.rank}</td>
        <td>
          <div class="team-cell">
            <img class="team-logo" src="${team.team.logo}">
            ${team.team.name}
          </div>
        </td>
        <td>${team.points}</td>
        <td>${team.all.played}</td>
        <td>${team.all.goals.for}</td>
        <td>${team.all.goals.against}</td>
        <td>${team.goalsDiff}</td>
      </tr>
    `;
  });
}

function pintarFixtures(lista) {
  if (!lista || lista.length === 0) {
    fixturesBody.innerHTML =
      `<tr><td colspan="6">No hay partidos próximos ni recientes para mostrar.</td></tr>`;
    return;
  }

  fixturesBody.innerHTML = "";

  lista.forEach(item => {
    const f = item.fixture;
    const date = new Date(f.date);
    const fecha = date.toLocaleString("es-ES");

    fixturesBody.innerHTML += `
      <tr>
        <td>${fecha}</td>
        <td><img src="${item.teams.home.logo}" class="team-logo"> ${item.teams.home.name}</td>
        <td>vs</td>
        <td><img src="${item.teams.away.logo}" class="team-logo"> ${item.teams.away.name}</td>
        <td>${item.goals.home ?? "-"} - ${item.goals.away ?? "-"}</td>
        <td>${f.status.long}</td>
      </tr>
    `;
  });
}

// Nombre bonito
function nombreBonito(key) {
  return {
    laliga: "LaLiga EA Sports",
    laliga2: "LaLiga Hypermotion",
    primeraRF: "Primera RFEF",
    premier: "Premier League",
    seriea: "Serie A",
    bundes: "Bundesliga",
    ligue1: "Ligue 1",
    champions: "Champions League",
    europa: "Europa League",
    conference: "Conference League"
  }[key];
}
