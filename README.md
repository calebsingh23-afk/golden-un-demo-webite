# Golden Sun Supermarket website

## Open the local preview

Install Node.js LTS if you don't already have it. Open a terminal in this folder and run:

```powershell
node preview.mjs
```

Open the **Local preview** address printed in the terminal. Leave the terminal running while you use the site. The browser refreshes when you save a website file. Press **Ctrl+C** in the terminal to stop it. If port 4173 is busy, set `$env:GOLDEN_SUN_PORT = '4174'` before starting.

This uses the Sites buildless starter approach with HTML, CSS and browser JavaScript. The four pages are ordinary HTML files, and the local Node server supplies live refresh. There are no packages to install and no database or account to maintain.

## Update specials and store details

Edit **store-data.json** in a text editor such as VS Code.

- **Specials** go in the `campaigns` list. Add one campaign per set of validity dates and source. Use a verified Golden Sun leaflet or a price list supplied by the store. Leave the list empty when you have no verified campaigns.
- **Dates** use `YYYY-MM-DD`. Both the start and end dates are included. The site compares them with the current date in Africa/Johannesburg each time the page opens and displays the dates in South African format.
- **Source** is required. Record the official source URL or a traceable description of the supplied price list, such as its filename and issue date. Set `leaflet` to the original public URL or a local PDF path when available. Keep any local PDF in `assets`.
- **Offers** need `name`, `pack`, `department` and a numeric `price` in rand. Department IDs are `produce`, `butchery`, `bakery` and `pantry`. Use optional `pricePrefix` for multi-buy wording, `priceSuffix` for a pricing unit and `conditions` for purchase limits or other terms. Copy wording from the leaflet.
- **Contact details** are under `store`. After editing the address, phone numbers or email, run `node build.mjs` in this folder to refresh all four HTML pages. Store phone numbers should use South African local format, beginning with zero. The directions destination is built from the address.

This is the shape of a campaign. The angle-bracket values are instructions to replace before adding an entry.

```text
{
  "source": "<verified source>",
  "leaflet": "<original leaflet link, if available>",
  "from": "<start date in YYYY-MM-DD>",
  "to": "<end date in YYYY-MM-DD>",
  "offers": [
    {
      "name": "<product name>",
      "pack": "<pack size or unit>",
      "department": "<department ID>",
      "price": <numeric rand amount>,
      "pricePrefix": "<multi-buy wording, if applicable>",
      "priceSuffix": "<pricing unit, if applicable>",
      "conditions": "<purchase limits or other terms, if applicable>"
    }
  ]
}
```

Review the specials page after saving. Live campaigns appear on Specials and in department search. The home page shows up to four live offers in data order.

## Artwork and sources

- `assets/golden-sun.svg` contains the editable wordmark, sun and sweep. `assets/sun-mark.svg` is the compact mark used in the mobile header and favicon. The SVGs were drawn from the written brief because the logo attachment was unavailable.
- The grocery and department images are generated illustrations. Replace them with approved store imagery when available. Review the image descriptions in `content.mjs` and `build.mjs` when replacing the photos, then run `node build.mjs`.
- The official [contact page](https://goldensuntongaat.co.za/contact-us/) supplies the store details. The [official specials page](https://goldensuntongaat.co.za/) listed October campaigns ending by 2 November 2026. The initial offer list is empty.
