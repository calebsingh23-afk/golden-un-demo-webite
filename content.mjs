export const departments = [
  { id: "produce", name: "Fresh Produce", image: "produce.jpg", alt: "Oranges, tomatoes and greens in market crates", description: "Fruit and vegetables for lunchboxes, sides and everyday meals." },
  { id: "butchery", name: "Butchery", image: "butchery.jpg", alt: "Raw butcher cuts with rosemary on paper", description: "A department to check when planning dinner or getting ready for a braai." },
  { id: "bakery", name: "Bakery", image: "bakery.jpg", alt: "Golden bread loaves and rolls on linen", description: "A stop for the bread and baked goods on your shopping list." },
  { id: "pantry", name: "Pantry", image: "pantry.jpg", alt: "Dry pasta, rice and beans in glass jars", description: "Cupboard staples for quick meals and cooking from scratch." }
];

export const noSpecials = "No current specials are listed. Contact the store for the latest offers.";
export const directions = store => "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(["Golden Sun Supermarket", ...store.address, "South Africa"].join(", "));
export const telephone = phone => "tel:+27" + phone.replace(/\D/g, "").slice(1);

export function liveOffers(campaigns, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const today = ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
  return campaigns
    .filter(({ from, to, source }) => source && from <= today && today <= to)
    .flatMap(({ offers, ...campaign }) => offers.map(offer => ({ ...offer, campaign })));
}
