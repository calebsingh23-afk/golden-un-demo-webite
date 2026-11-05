import { departments, liveOffers } from "./content.mjs";

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
menu.hidden = false;
menu.addEventListener("click", () => {
  menu.setAttribute("aria-expanded", String(menu.getAttribute("aria-expanded") === "false"));
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    menu.setAttribute("aria-expanded", "false");
    if (getComputedStyle(menu).display !== "none") menu.focus();
  }
});
nav.addEventListener("click", event => {
  if (event.target.closest("a")) menu.setAttribute("aria-expanded", "false");
});

const container = document.querySelector("[data-offers]");
if (container) loadOffers(container).catch(error => console.error("Could not load specials", error));

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Johannesburg"
});
const priceFormatter = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });

function dateLabel(date) {
  const time = element("time", dateFormatter.format(new Date(date + "T12:00:00Z")));
  time.dateTime = date;
  return time;
}

function offerCard(offer) {
  const card = element("article", "", "offer");
  card.append(element("h3", offer.name), element("p", offer.pack));
  card.append(element("p", [offer.pricePrefix, priceFormatter.format(offer.price), offer.priceSuffix].filter(Boolean).join(" "), "price"));
  if (offer.conditions) card.append(element("p", offer.conditions));
  const dates = element("p");
  dates.append(dateLabel(offer.campaign.from), " – ", dateLabel(offer.campaign.to));
  card.append(dates);
  if (offer.campaign.leaflet) {
    const link = element("a", "View original leaflet");
    link.href = offer.campaign.leaflet;
    card.append(link);
  }
  return card;
}

async function loadOffers(target) {
  const response = await fetch("./store-data.json");
  if (!response.ok) throw new Error("Specials data is unavailable");
  const { campaigns } = await response.json();
  const offers = liveOffers(campaigns);
  if (offers.length === 0) return;

  const isFeatured = target.classList.contains("featured");
  const section = target.closest("#department-products");
  if (section) section.hidden = false;
  const grid = element("div", "", "offer-grid");
  if (isFeatured) {
    grid.append(...offers.slice(0, 4).map(offerCard));
    target.replaceChildren(grid);
    return;
  }

  const controls = element("div", "", "offer-controls");
  const search = element("input");
  search.type = "search";
  search.placeholder = "e.g. rice";
  const searchLabel = element("label", "Search offers");
  searchLabel.append(search);

  const category = element("select");
  category.append(new Option("All departments", ""));
  for (const department of departments) {
    if (offers.some(offer => offer.department === department.id)) {
      category.append(new Option(department.name, department.id));
    }
  }
  if (section && [...category.options].some(option => option.value === location.hash.slice(1))) {
    category.value = location.hash.slice(1);
  }
  const categoryLabel = element("label");
  const categoryCaption = element("span", "Department");
  categoryCaption.id = "offer-department-label";
  category.setAttribute("aria-labelledby", categoryCaption.id);
  categoryLabel.append(categoryCaption, category);
  controls.append(searchLabel, categoryLabel);
  const status = element("p");
  status.setAttribute("role", "status");
  target.replaceChildren(controls, status, grid);

  function render() {
    const term = search.value.trim().toLocaleLowerCase("en-ZA");
    const results = offers.filter(offer => (!category.value || offer.department === category.value) &&
      (offer.name + " " + offer.pack).toLocaleLowerCase("en-ZA").includes(term));
    status.textContent = results.length ? `${results.length} ${results.length === 1 ? "offer" : "offers"}` : "No offers match your search.";
    grid.replaceChildren(...results.map(offerCard));
  }
  search.addEventListener("input", render);
  category.addEventListener("change", render);
  if (section) window.addEventListener("hashchange", () => {
    category.value = [...category.options].some(option => option.value === location.hash.slice(1)) ? location.hash.slice(1) : "";
    render();
  });
  render();
}
