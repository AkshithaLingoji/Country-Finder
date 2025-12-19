// ==========================
// STEP 1: DOM SELECTION
// ==========================

// Search
const countryForm = document.getElementById("countryForm");
const countryInput = document.getElementById("countryInput");

// Status
const statusEl = document.getElementById("status");

// Cards
const resultCard = document.getElementById("resultCard");
const errorCard = document.getElementById("errorCard");

// Header
const flagImg = document.getElementById("flagImg");
const nameCommon = document.getElementById("nameCommon");
const nameOfficial = document.getElementById("nameOfficial");

// Chips
const cca2 = document.getElementById("cca2");
const cca3 = document.getElementById("cca3");
const regionChip = document.getElementById("regionChip");
const subregionChip = document.getElementById("subregionChip");

// Stats
const capital = document.getElementById("capital");
const population = document.getElementById("population");
const area = document.getElementById("area");
const timezones = document.getElementById("timezones");
const languages = document.getElementById("languages");
const currencies = document.getElementById("currencies");
const callingCode = document.getElementById("callingCode");
const tld = document.getElementById("tld");
const borders = document.getElementById("borders");

// Media & links
const coatImg = document.getElementById("coatImg");
const gmaps = document.getElementById("gmaps");
const osmaps = document.getElementById("osmaps");

// Footer
const fifa = document.getElementById("fifa");
const carSide = document.getElementById("carSide");
const startOfWeek = document.getElementById("startOfWeek");


// ==========================
// STEP 2: PURE LOGIC FUNCTION
// ==========================

async function searchCountry(countryName) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
  );

  if (!response.ok) {
    return null; // No results
  }

  const data = await response.json();
  return data[0]; // Return first country
}


// ==========================
// STEP 3: FORM SUBMIT
// ==========================

countryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = countryInput.value.trim();

  // Validation
  if (!query) {
    statusEl.textContent = "Please enter a country name.";
    statusEl.className = "status err";
    return;
  }

  // Reset UI
  statusEl.textContent = "Searching...";
  statusEl.className = "status";
  resultCard.classList.add("hidden");
  errorCard.classList.add("hidden");

  // Call logic function
  const country = await searchCountry(query);

  // ==========================
  // STEP 4: DECISION + UI
  // ==========================

  if (!country) {
    statusEl.textContent = "No results. Try another country.";
    statusEl.className = "status err";
    errorCard.classList.remove("hidden");
    return;
  }

  // ==========================
  // STEP 5: RENDER DATA
  // ==========================

  // Header
  flagImg.src = country.flags.svg;
  nameCommon.textContent = country.name.common;
  nameOfficial.textContent = country.name.official;

  // Chips
  cca2.textContent = country.cca2;
  cca3.textContent = country.cca3;
  regionChip.textContent = country.region;
  subregionChip.textContent = country.subregion || "—";

  // Stats
  capital.textContent = country.capital?.[0] || "—";
  population.textContent = country.population.toLocaleString();
  area.textContent = country.area.toLocaleString();

  // Timezones
  timezones.innerHTML = "";
  country.timezones.forEach((tz) => {
    const li = document.createElement("li");
    li.textContent = tz;
    timezones.appendChild(li);
  });

  // Languages
  languages.innerHTML = "";
  if (country.languages) {
    Object.values(country.languages).forEach((lang) => {
      const li = document.createElement("li");
      li.textContent = lang;
      languages.appendChild(li);
    });
  }

  // Currencies
  currencies.innerHTML = "";
  if (country.currencies) {
    Object.values(country.currencies).forEach((cur) => {
      const li = document.createElement("li");
      li.textContent = `${cur.name} (${cur.symbol || ""})`;
      currencies.appendChild(li);
    });
  }

  // Calling code
  if (country.idd?.root) {
    callingCode.textContent =
      country.idd.root + (country.idd.suffixes?.[0] || "");
  } else {
    callingCode.textContent = "—";
  }

  // TLD
  tld.innerHTML = "";
  country.tld?.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;
    tld.appendChild(li);
  });

  // Borders
  borders.innerHTML = "";
  if (country.borders) {
    country.borders.forEach((b) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = b;
      borders.appendChild(span);
    });
  }

  // Media
  coatImg.src = country.coatOfArms.svg || "";
  gmaps.href = country.maps.googleMaps;
  osmaps.href = country.maps.openStreetMaps;

  // Footer
  fifa.textContent = country.fifa || "—";
  carSide.textContent = country.car?.side || "—";
  startOfWeek.textContent = country.startOfWeek || "—";

  // Show success
  resultCard.classList.remove("hidden");
  statusEl.textContent = "Result found ✔";
  statusEl.className = "status ok";
});
