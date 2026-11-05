import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url)).replace(/[\\/]$/, "");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".pdf": "application/pdf" };
const port = Number(process.env.GOLDEN_SUN_PORT || 4173);

createServer(async (req, res) => {
  try {
    const route = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (route === "/__version") {
      const files = (await readdir(root)).filter(name => /\.(html|css|json|mjs)$/.test(name));
      const assets = (await readdir(resolve(root, "assets"))).map(name => "assets/" + name);
      const times = await Promise.all([...files, ...assets].map(name => stat(resolve(root, name))));
      res.setHeader("Cache-Control", "no-store");
      return res.end(String(Math.max(...times.map(file => file.mtimeMs))));
    }
    const file = resolve(root, "." + (route === "/" ? "/index.html" : route));
    if (!file.startsWith(root + sep) || !types[extname(file)]) throw new Error("File unavailable");
    let body = await readFile(file);
    if (extname(file) === ".html" && !body.includes("/__version")) {
      body = body.toString().replace("</body>", `<script>let version;setInterval(async()=>{try{const current=await(await fetch('/__version',{cache:'no-store'})).text();if(version&&current!==version)location.reload();version=current}catch{}},1500)</script></body>`);
    }
    res.writeHead(200, { "Content-Type": types[extname(file)], "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Page not found");
  }
}).listen(port, "127.0.0.1", () => console.log("Local preview: http://127.0.0.1:" + port));
