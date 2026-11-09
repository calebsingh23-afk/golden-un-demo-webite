import { readFile, writeFile } from "node:fs/promises";
import { departments, directions, telephone, noSpecials } from "./content.mjs";

const file = name => new URL(name, import.meta.url);
const { store } = JSON.parse((await readFile(file("store-data.json"), "utf8")).replace(/^\uFEFF/, ""));
const escape = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const icon = path => `<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
const arrow = icon('<path d="M4 12h15m-6-6 6 6-6 6"/>');
const pin = icon('<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/>');
const phone = icon('<path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a13 13 0 0 1-6-6l2-2Z"/>');
const map = escape(directions(store));
const firstPhone = escape(telephone(store.phones[0]));
const address = store.address.map(escape).join("<br>");
const links = [["index.html", "Home"], ["specials.html", "Specials"], ["departments.html", "Departments"], ["visit.html", "Visit & Contact"]];
const nav = page => links.map(([url, label]) => `<a href="${url}"${page === url ? ' aria-current="page"' : ''}>${label}</a>`).join("");
const logo = `<img class="logo-full" src="assets/golden-sun.svg" width="232" height="53" alt="Golden Sun Supermarket"><span class="logo-mobile" aria-hidden="true"><img src="assets/sun-mark.svg" width="43" height="36" alt="">Golden Sun</span>`;
const photo = (d, cls = "") => `<img class="${cls}" src="assets/${d.image}" width="512" height="511" loading="lazy" alt="${d.alt}">`;
const empty = (className = "") => `<div class="offers ${className}" data-offers><div class="empty"><p>${noSpecials}</p><a class="text-link" href="${firstPhone}">Call the store ${arrow}</a></div></div>`;
const location = `<section class="visit-band" aria-labelledby="location-title"><div><h2 id="location-title">Find us in Tongaat</h2><address>${address}</address></div><div class="actions"><a class="button gold" href="${map}">${pin} Get directions</a><a class="button outline" href="${firstPhone}">${phone} ${escape(store.phones[0])}</a><a class="text-link" href="visit.html">All contact details ${arrow}</a></div></section>`;
const pages = {
  "index.html": ["Golden Sun Supermarket | Tongaat", `
    <section class="hero" aria-labelledby="home-heading">
      <img class="hero-photo" src="assets/hero.jpg" width="1536" height="511" fetchpriority="high" alt="Crates of oranges, tomatoes and leafy greens">
      <div class="hero-panel"><h1 id="home-heading">All about<br><em>savings!</em></h1><p>Plan your grocery shop at Golden Sun Supermarket in Tongaat.</p><div class="actions"><a class="button gold" href="specials.html">View specials ${arrow}</a><a class="text-link" href="${map}">${pin} Get directions</a></div></div>
    </section>
    <section class="section" aria-labelledby="departments-title"><div class="section-heading"><h2 id="departments-title">Shop by department</h2><a class="text-link" href="departments.html">All departments ${arrow}</a></div>
      <div class="department-grid">${departments.map(d => `<a class="department-tile" href="departments.html#${d.id}">${photo(d)}<span>${d.name} ${arrow}</span></a>`).join("")}</div>
    </section>
    <section class="section" aria-labelledby="featured-title"><div class="section-heading"><h2 id="featured-title">In-store specials</h2><a class="text-link" href="specials.html">See specials ${arrow}</a></div>${empty("featured")}</section>
    ${location}`],
  "specials.html": ["In-store specials | Golden Sun", `
    <section class="page-intro"><h1>In-store specials</h1><p>Check the latest Golden Sun offers before you head to the shop.</p></section>
    <section class="section inner-section" aria-labelledby="specials-title"><h2 id="specials-title">Current offers</h2>${empty()}</section>${location}`],
  "departments.html": ["Departments | Golden Sun", `
    <section class="page-intro"><h1>Grocery departments</h1><p>Plan your next shop, from the produce aisle to the pantry.</p></section>
    <nav class="jump-links" aria-label="Jump to a department">${departments.map(d => `<a href="#${d.id}">${d.name} ${arrow}</a>`).join("")}</nav>
    <section class="department-details" aria-label="Departments">${departments.map(d => `<article id="${d.id}" class="department-detail">${photo(d)}<div><h2>${d.name}</h2><p>${d.description}</p></div></article>`).join("")}</section>
    <section class="section inner-section" id="department-products" aria-labelledby="department-offers-title" hidden><h2 id="department-offers-title">Products on special</h2><div class="offers" data-offers></div></section>${location}`],
  "visit.html": ["Visit & contact | Golden Sun", `
    <section class="page-intro"><h1>Visit &amp; contact</h1><p>Find Golden Sun Supermarket in Mitchell Village, Tongaat.</p></section>
    <div class="contact-grid">
      <section class="contact-block"><span class="contact-icon">${pin}</span><h2>Find the store</h2><address>${address}</address><a class="button gold" href="${map}">Get directions ${arrow}</a></section>
      <section class="contact-block"><span class="contact-icon">${phone}</span><h2>Get in touch</h2><ul>${store.phones.map(number => `<li><a href="${escape(telephone(number))}">${escape(number)}</a></li>`).join("")}<li><a href="mailto:${escape(store.email)}">${escape(store.email)}</a></li></ul></section>
    </div>`]
};

function layout(page, title, main) {
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Check in-store specials, browse grocery departments and find Golden Sun Supermarket in Tongaat, KwaZulu-Natal.">
<title>${title}</title>
<link rel="icon" href="assets/sun-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css">
<script type="module" src="site.mjs"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap top-inner"><span>${pin} Tongaat, KwaZulu-Natal</span><a href="${firstPhone}">${phone} ${escape(store.phones[0])}</a></div></div>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="index.html" aria-label="Golden Sun Supermarket home">${logo}</a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" hidden>Menu ${icon('<path d="M4 6h16M4 12h16M4 18h16"/>')}</button>
<nav id="primary-nav" aria-label="Main navigation">${nav(page)}</nav><a class="header-directions text-link" href="${map}">${pin} Directions</a></div></header>
<main id="main" class="wrap" tabindex="-1">${main}</main>
<footer><div class="wrap footer-inner"><div class="footer-brand"><img src="assets/sun-mark.svg" width="53" height="44" alt=""><div><strong>Golden Sun Supermarket</strong><div>All about Savings!</div></div></div><nav aria-label="Footer navigation">${nav(page)}</nav></div></footer>
</body>
</html>`;
}

await Promise.all(Object.entries(pages).map(([page, [title, main]]) => writeFile(file(page), layout(page, title, main))));
