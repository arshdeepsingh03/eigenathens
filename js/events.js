// Talk content and form mappings live in /data/talk-series.json.
function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function makeTalkCard(talk) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.id = `talk-${talk.id}`;
  card.innerHTML = `
    <div class="event-row">
      <img class="event-poster" src="${escapeHtml(talk.poster)}" alt="${escapeHtml(talk.title)} poster" loading="lazy">
      <div class="event-details">
        <h2 class="event-title">${escapeHtml(talk.title)}</h2>
        <p class="event-description">${escapeHtml(talk.description)}</p>
        <button class="register-button" type="button" aria-expanded="false"
          aria-controls="regions-${escapeHtml(talk.id)} form-${escapeHtml(talk.id)}">Register</button>
        <div id="regions-${escapeHtml(talk.id)}" class="timezone-picker" hidden>
          <h3 id="region-heading-${escapeHtml(talk.id)}">Choose your timezone region</h3>
          <div class="timezone-options" role="group" aria-labelledby="region-heading-${escapeHtml(talk.id)}"></div>
        </div>
      </div>
    </div>
    <div id="form-${escapeHtml(talk.id)}" class="registration-panel" hidden>
      <h3 class="registration-title" aria-live="polite"></h3>
      <p>Registration is handled by Google Forms. Google may ask you to sign in.</p>
      <div class="frame-container"></div>
    </div>`;

  const options = card.querySelector(".timezone-options");
  talk["tz-regions"].forEach(function (region) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "timezone-option";
    option.dataset.region = region.id;
    option.textContent = region.name;
    option.setAttribute("aria-pressed", "false");
    option.setAttribute("aria-controls", `form-${talk.id}`);
    option.addEventListener("click", function () { selectRegion(card, talk, region); });
    options.appendChild(option);
  });
  card.querySelector(".register-button").addEventListener("click", function () {
    setRegistrationOpen(card, card.querySelector(".timezone-picker").hidden);
  });
  return card;
}

function setRegistrationOpen(card, open) {
  card.querySelector(".timezone-picker").hidden = !open;
  card.querySelector(".registration-panel").hidden = !open || !card.dataset.region;
  const button = card.querySelector(".register-button");
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Close registration" : "Register";
}

function selectRegion(card, talk, region) {
  if (card.dataset.region !== region.id) {
    const iframe = document.createElement("iframe");
    iframe.className = "google-form-frame";
    iframe.src = region.googleFormUrl;
    iframe.title = `${talk.title} registration — ${region.name}`;
    card.querySelector(".frame-container").replaceChildren(iframe);
    card.dataset.region = region.id;
  }
  card.querySelectorAll(".timezone-option").forEach(function (option) {
    option.setAttribute("aria-pressed", String(option.dataset.region === region.id));
  });
  card.querySelector(".registration-title").textContent = `Register — ${region.name}`;
  setRegistrationOpen(card, true);
}

function validateTalks(data) {
  if (!Array.isArray(data["talk-series"])) throw new Error("Missing talk-series list");
  const talkIds = new Set();
  data["talk-series"].forEach(function (talk) {
    if (!talk || !/^[a-z0-9-]+$/.test(talk.id) || talkIds.has(talk.id)) throw new Error("Invalid or duplicate talk ID");
    talkIds.add(talk.id);
    ["title", "description", "poster"].forEach(function (key) {
      if (typeof talk[key] !== "string" || !talk[key].trim()) throw new Error(`Missing talk ${key}`);
    });
    if (!Array.isArray(talk["tz-regions"]) || !talk["tz-regions"].length) throw new Error("Missing timezone regions");
    const regionIds = new Set();
    talk["tz-regions"].forEach(function (region) {
      if (!region || typeof region.id !== "string" || !/^[a-z0-9-]+$/.test(region.id) || regionIds.has(region.id)
        || typeof region.name !== "string" || !region.name.trim()
        || typeof region.googleFormUrl !== "string"
        || !/^https:\/\/docs\.google\.com\/forms\//.test(region.googleFormUrl)) throw new Error("Invalid timezone region");
      regionIds.add(region.id);
    });
  });
  return data["talk-series"];
}

async function renderEvents() {
  const list = document.getElementById("events-list");
  list.textContent = "Loading talks…";
  list.setAttribute("aria-busy", "true");
  try {
    // A fresh URL also avoids reusing a CDN copy of the editable content file.
    const response = await fetch(`/data/talk-series.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load talks");
    const talks = validateTalks(await response.json());
    const cards = talks.map(makeTalkCard);
    list.replaceChildren(...cards);
    if (!talks.length) list.textContent = "No upcoming talks. Please check back soon.";

    const params = new URLSearchParams(window.location.search);
    const talkId = params.get("talk");
    const regionId = params.get("region") || params.get("location");
    // Old location links still target the first talk; new links identify both.
    const index = talkId ? talks.findIndex(talk => talk.id === talkId) : 0;
    const talk = talks[index];
    const region = talk && talk["tz-regions"].find(item => item.id === regionId);
    if (region) {
      selectRegion(cards[index], talk, region);
      cards[index].scrollIntoView({ block: "start" });
    }
  } catch (error) {
    list.textContent = "Talks could not be loaded. ";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "secondary-button";
    retry.textContent = "Try again";
    retry.addEventListener("click", renderEvents);
    list.appendChild(retry);
    console.error("Unable to load talk data:", error);
  } finally {
    list.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("DOMContentLoaded", renderEvents);
