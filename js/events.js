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

function makeEventCard(event) {
  const article = document.createElement("article");
  article.className = "event-card";
  article.id = `event-${event.slug}`;
  article.dataset.location = event.slug;

  article.innerHTML = `
    <div class="event-row">
      <img class="event-poster" src="../assets/talk-poster.jpg" alt="Poster for The Geometry of Number">

      <div>
        <div class="event-eyebrow">Same talk · ${escapeHtml(event.location)}</div>
        <h2 class="event-title">The Geometry of Number</h2>
        <div class="event-meta">
          <span><strong>${escapeHtml(event.location)}</strong></span>
          <span>${escapeHtml(event.date)}</span>
          <span>${escapeHtml(event.time)}</span>
          <span>${escapeHtml(event.venue)}</span>
        </div>
      </div>

      <button class="register-button" type="button" aria-expanded="false">
        Register
      </button>
    </div>

    <div class="registration-panel" aria-hidden="true">
      <h3>Register — ${escapeHtml(event.location)}</h3>
      <p>
        Registration is handled by Google Forms. Google may ask you to sign in.
        Submission and validation messages appear inside the form.
      </p>
      <div class="frame-container"></div>
    </div>
  `;

  const button = article.querySelector(".register-button");
  button.addEventListener("click", function () {
    const currentlyOpen = article.querySelector(".registration-panel").classList.contains("open");
    closeAllForms();
    if (!currentlyOpen) openForm(article, event, true);
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

function closeAllForms() {
  document.querySelectorAll(".event-card").forEach(function (card) {
    const panel = card.querySelector(".registration-panel");
    const button = card.querySelector(".register-button");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Register";
  });
}

function openForm(card, event, userInitiated) {
  const panel = card.querySelector(".registration-panel");
  const container = card.querySelector(".frame-container");
  const button = card.querySelector(".register-button");

  if (!container.querySelector("iframe")) {
    const iframe = document.createElement("iframe");
    iframe.className = "google-form-frame";
    iframe.src = event.googleFormUrl;
    iframe.title = `Google registration form for ${event.location}`;
    iframe.loading = "lazy";
    container.appendChild(iframe);
  }

  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  button.setAttribute("aria-expanded", "true");
  button.textContent = "Close form";

  if (!userInitiated) {
    card.scrollIntoView({ block: "start" });
  }
}

function renderEvents() {
  const list = document.getElementById("events-list");
  EVENTS.forEach(function (event) {
    list.appendChild(makeEventCard(event));
  });

  // Ad/deep-link behavior. Example:
  // https://eigenathens.org/events/?location=coquitlam
  const location = new URLSearchParams(window.location.search).get("location");
  if (!location) return;

  const event = EVENTS.find(function (item) {
    return item.slug === location;
  });

  if (!event) return;

  const card = document.getElementById(`event-${event.slug}`);
  openForm(card, event, false);
}

document.addEventListener("DOMContentLoaded", renderEvents);
