/*
  Edit this one array when you change event instances.

  IMPORTANT:
  Replace each googleFormUrl with the EMBED URL from Google Forms.
  It normally ends with: /viewform?embedded=true

  Deep links:
    /events/?location=vancouver
    /events/?location=burnaby
    /events/?location=coquitlam
    /events/?location=surrey
    /events/?location=white-rock
*/

const EVENTS = [
  {
    slug: "vancouver",
    location: "Vancouver",
    venue: "Downtown Vancouver — venue details on form",
    date: "October 16, 2026",
    time: "7:00–9:00 PM",
    googleFormUrl: "https://docs.google.com/forms/d/e/EXAMPLE_VANCOUVER/viewform?embedded=true"
  },
  {
    slug: "burnaby",
    location: "Burnaby",
    venue: "Central Burnaby — venue details on form",
    date: "October 18, 2026",
    time: "7:00–9:00 PM",
    googleFormUrl: "https://docs.google.com/forms/d/e/EXAMPLE_BURNABY/viewform?embedded=true"
  },
  {
    slug: "coquitlam",
    location: "Coquitlam",
    venue: "Coquitlam — venue details on form",
    date: "October 20, 2026",
    time: "7:00–9:00 PM",
    googleFormUrl: "https://docs.google.com/forms/d/e/EXAMPLE_COQUITLAM/viewform?embedded=true"
  },
  {
    slug: "surrey",
    location: "Surrey",
    venue: "Surrey — venue details on form",
    date: "October 22, 2026",
    time: "7:00–9:00 PM",
    googleFormUrl: "https://docs.google.com/forms/d/e/EXAMPLE_SURREY/viewform?embedded=true"
  },
  {
    slug: "white-rock",
    location: "White Rock",
    venue: "White Rock — venue details on form",
    date: "October 24, 2026",
    time: "7:00–9:00 PM",
    googleFormUrl: "https://docs.google.com/forms/d/e/EXAMPLE_WHITE_ROCK/viewform?embedded=true"
  }
];

function makeEventCard() {
  const article = document.createElement("article");
  article.className = "event-card";
  article.id = "event-geometry-of-number";
  article.innerHTML = `
    <div class="event-row">
      <img class="event-poster" src="/assets/talk-poster.jpg" alt="Poster for The Geometry of Number">
      <div>
        <div class="event-eyebrow">Free mathematics talk · Multiple locations</div>
        <h2 class="event-title">The Geometry of Number</h2>
        <div class="event-meta">
          <span>October 16–24, 2026</span>
          <span>7:00–9:00 PM</span>
        </div>
      </div>
      <button class="register-button" type="button" aria-expanded="false" aria-controls="event-registration">
        Register
      </button>
    </div>
    <div id="event-registration" class="registration-panel" hidden>
      <h3 id="location-heading">Choose your location</h3>
      <p>Select a location to open its registration form.</p>
      <div class="location-options" role="group" aria-labelledby="location-heading"></div>
      <div class="selected-registration" hidden>
        <h3 class="registration-title" aria-live="polite"></h3>
        <p>Registration is handled by Google Forms. Google may ask you to sign in.</p>
        <div class="frame-container"></div>
      </div>
    </div>
  `;

  const options = article.querySelector(".location-options");
  EVENTS.forEach(function (event) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "location-option";
    option.dataset.location = event.slug;
    option.setAttribute("aria-pressed", "false");
    option.innerHTML = `
      <strong>${escapeHtml(event.location)}</strong>
      <span>${escapeHtml(event.date)} · ${escapeHtml(event.time)}</span>
      <span>${escapeHtml(event.venue)}</span>
    `;
    option.addEventListener("click", function () {
      selectLocation(article, event);
    });
    options.appendChild(option);
  });

  const button = article.querySelector(".register-button");
  button.addEventListener("click", function () {
    const panel = article.querySelector(".registration-panel");
    setRegistrationOpen(article, panel.hidden);
  });
  return article;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setRegistrationOpen(card, open) {
  const panel = card.querySelector(".registration-panel");
  const button = card.querySelector(".register-button");
  panel.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Close registration" : "Register";
}

function selectLocation(card, event) {
  const container = card.querySelector(".frame-container");
  // Keep the current form intact when its location is selected again.
  if (card.dataset.location !== event.slug) {
    const iframe = document.createElement("iframe");
    iframe.className = "google-form-frame";
    iframe.src = event.googleFormUrl;
    iframe.title = `Google registration form for ${event.location}`;
    container.replaceChildren(iframe);
    card.dataset.location = event.slug;
  }
  card.querySelectorAll(".location-option").forEach(function (option) {
    option.setAttribute("aria-pressed", String(option.dataset.location === event.slug));
  });
  card.querySelector(".registration-title").textContent = `Register — ${event.location}`;
  card.querySelector(".selected-registration").hidden = false;
  setRegistrationOpen(card, true);
}

function renderEvents() {
  const list = document.getElementById("events-list");
  const card = makeEventCard();
  list.replaceChildren(card);

  // Preserve location-specific ad links and load only the selected form.
  const location = new URLSearchParams(window.location.search).get("location");
  const event = EVENTS.find(function (item) {
    return item.slug === location;
  });
  if (!event) return;
  selectLocation(card, event);
  card.scrollIntoView({ block: "start" });
}

document.addEventListener("DOMContentLoaded", renderEvents);
