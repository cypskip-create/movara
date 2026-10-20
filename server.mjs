import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openStore } from "./lib/store.mjs";
const root = path.dirname(fileURLToPath(import.meta.url));
const store = openStore(path.join(root, "data", "marketplace.json"));
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".json": "application/json",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("X-Frame-Options", "DENY");
  const url = new URL(req.url, "http://localhost");
  const json = (code, value) => {
    res.writeHead(code, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(value));
  };
  try {
    if (url.pathname.startsWith("/api/")) {
      if (
        !["127.0.0.1", "localhost"].includes(
          (req.headers.host || "").split(":")[0],
        )
      )
        return json(403, { error: "Local demo access only." });
      if (req.method === "GET" && url.pathname === "/api/state")
        return json(200, { ...store.read(), mode: "local-demo" });
      if (req.method !== "POST")
        return json(404, { error: "Endpoint not found." });
      if (
        req.headers.origin &&
        ![
          "http://localhost:" + port,
          "http://127.0.0.1:" + port,
          "http://127.0.0.1:5173",
          "http://localhost:5173",
        ].includes(req.headers.origin)
      )
        return json(403, { error: "Origin not allowed." });
      if (!req.headers["content-type"]?.includes("application/json"))
        return json(415, { error: "JSON required." });
      let raw = "";
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 16000)
          return json(413, { error: "Request too large." });
      }
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return json(400, { error: "Invalid JSON." });
      }
      if (!body || typeof body !== "object" || Array.isArray(body))
        return json(400, { error: "JSON object required." });
      const action = url.pathname.slice(5);
      if (
        ![
          "shipments",
          "bookings",
          "messages",
          "vehicles",
          "status",
          "payments",
        ].includes(action)
      )
        return json(404, { error: "Endpoint not found." });
      return json(201, store.write(action, body));
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      return res.end();
    }
    const dist = path.join(root, "dist");
    let file = path.resolve(dist, "." + decodeURIComponent(url.pathname));
    if (!file.startsWith(dist + path.sep) && file !== dist) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(dist, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(503);
      return res.end("Run npm run build first.");
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control":
        path.extname(file) === ".html" ? "no-cache" : "public, max-age=3600",
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  } catch (error) {
    if (!res.headersSent)
      json(error.status || 500, {
        error: error.status ? error.message : "Unable to complete request.",
      });
    else res.end();
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    `Movara is running at http://localhost:${port} (local demo, saved in data/marketplace.json)`,
  ),
);
