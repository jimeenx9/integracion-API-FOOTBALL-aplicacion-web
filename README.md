# 📘 Integración API-FOOTBALL con Aplicación Web (HTML · CSS · JS)
---

- **Autor:** Alberto Jiménez Rodríguez  
- **Curso:** 2025/2026 

---

![Vista previa del proyecto](/img/app.png)


## 🟦 1. Introducción

Este proyecto implementa una **aplicación web completamente funcional** que consume datos reales de fútbol utilizando la API oficial **API-FOOTBALL (v3)**.

Permite consultar:

- 🟩 Clasificación actual/histórica de ligas
- 🟩 Próximos partidos
- 🟩 Últimos resultados
- 🟩 Información dinámica por liga
- 🟩 Logos oficiales de ligas y equipos

Todo está construido con:

- **HTML5**
- **CSS3**
- **JavaScript (Fetch API)**
- **API-FOOTBALL v3**

Este README explica, paso por paso, **cómo conectar nuestra web a API-FOOTBALL**, cómo se obtienen los IDs, cómo se interpretan los JSON y cómo los pintamos en pantalla.

---

## 🟦 2. Activación de la API y obtención de la API KEY

### 1. Entramos en el dashboard oficial:

👉 <https://dashboard.api-football.com/>

### 2. En la sección **Football**, creamos/obtenemos nuestra API Key

**📸 API KEY**

![API Key](/img/apikey.png)


Se muestra: API Key, estado del servicio y panel principal.

En el código se almacena:

```js
const API_KEY = "TU_API_KEY_AQUI";
const BASE_URL = "https://v3.football.api-sports.io";
```

---
## 🟦 3. Exploración de endpoints y documentación oficial

Usamos **exclusivamente** la documentación oficial:

👉 [https://www.api-football.com/documentation-v3](https://www.api-football.com/documentation-v3)

Las secciones clave fueron:

- **Standings** (Clasificación)
- **Fixtures** (Partidos)
- **Leagues** (Información de liga)
- **Teams** (Equipos y logos)
- **Assets** (Logos públicos)

**📸 Standings**
![Documentación Standings](/img/standings.png)

**📸 Fixtures**
![Documentación Fixtures](/img/fixtures.png)

**📸 Leagues**
![Documentación Leagues](/img/leagues.png)

En estas capturas vemos:

- Los parámetros obligatorios (league, season)
- El formato del JSON de respuesta
- Cómo se forma la URL de solicitud
- Qué campos devuelve cada endpoint

---
## 🟦 4. Obtención de los IDs de las ligas

Los **ID oficiales** se sacaron desde:

👉 Dashboard → Football → IDs

**📸 IDS**

![IDs de las ligas](/img/ids.png)

Se ve el buscador mostrando ligas de España, Inglaterra, Italia, etc.

Luego los registramos en nuestro JS:

```js
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
```

Estos IDs permiten hacer las solicitudes de manera dinámica.

---

## 🟦 5. Cómo funcionan las llamadas a la API (NUCLEO REAL DEL PROYECTO)

Toda la comunicación API se hace desde una sola función:

```js
async function apiGet(endpoint, params = {}) {

  const url = new URL(BASE_URL + endpoint);

  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.append(k, v)
  );

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": API_KEY }
  });

  return res.json();

}
```


**Esto permite hacer llamadas del tipo:**

`GET https://v3.football.api-sports.io/standings?league=140&season=2023`

`GET https://v3.football.api-sports.io/fixtures?next=10&league=140&season=2023`

---

## 🟦 6. Lectura e interpretación del JSON de la API

Esta es la parte más importante.

**Cuando pedimos standings:**

`/standings?league=39&season=2019`

**La API responde con una estructura como esta:**
```json
{
  "response": [
    {
      "league": {
        "standings": [
          [
            {
              "rank": 1,
              "team": { "id": 40, "name": "Liverpool", "logo": "..." },
              "points": 70,
              "all": {
                "played": 24,
                "goals": { "for": 56, "against": 15 }
              }
            }
          ]
        ]
      }
    }
  ]
}
```

### 🔍 ¿Qué hacemos exactamente con este JSON?

1. Navegamos dentro de **response[0].league.standings[0]**
2. Ese array contiene **cada equipo**
3. Lo recorremos con `.forEach()`
4. De cada equipo extraemos:
   - `rank`
   - `team.name`
   - `team.logo`
   - `points`
   - `all.played`
   - `all.goals.for`
   - `all.goals.against`
   - `goalsDiff`
5. Finalmente lo pintamos en la tabla:

```js
function pintarClasificacion(lista) {
  lista.forEach(team => {
    tablaBody.innerHTML += `
      <tr>
        <td>${team.rank}</td>
        <td>
          <img src="${team.team.logo}" class="team-logo">
          ${team.team.name}
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
```


**Hacemos exactamente lo que la documentación indica**, leyendo los campos que ellos definen.

---

## 🟦 7. Fallback de temporadas (truco para el plan FREE)

El plan FREE no siempre permite consultar la temporada actual.

Por eso implementamos un sistema que **prueba temporadas hacia atrás hasta encontrar datos**:
```js
const temporadas = [2023, 2022, 2021, 2020, 2019, 2018];
```

Esto garantiza que **siempre habrá una clasificación disponible**.

---

## 🟦 8. Pintar los datos en el DOM

Toda la web se actualiza dinámicamente según la liga seleccionada.

**Interacción de usuario:**

```js
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setActive(btn);
    cargarLiga(btn.dataset.liga);
  });
});
```

---

## 🟦 9. Capturas para el README

Aquí tienes la lista exacta:

| Imagen | Descripción |
|--------|-------------|
| ![Dashboard inicio](/img/inicio.png) | Dashboard principal de API-FOOTBALL |
| ![API Key](/img/apikey.png) | Vista con la API KEY visible |
| ![IDs de ligas](/img/ids.png) | Tabla con los IDs oficiales de las ligas |
| ![Documentación Standings](/img/standings.png) | Documentación del endpoint Standings |
| ![Documentación Fixtures](/img/fixtures.png) | Documentación del endpoint Fixtures |
| ![Documentación Leagues](/img/leagues.png) | Documentación del endpoint Leagues |
| ![Requests Dashboard](/img/request.png) | Sección de Requests del dashboard de API-FOOTBALL |

Esto demuestra:

- De dónde vienen los IDs
- Qué documentación se consultó
- Cómo se testearon las solicitudes
- La estructura de los JSON
- El funcionamiento real del endpoint

---

## 🟩 10. Resultado final

✔ Web completamente funcional\
✔ Datos reales de la API\
✔ Integración profesional\
✔ Funciona con plan FREE gracias al fallback\
✔ Completamente preparado para entregar

---

