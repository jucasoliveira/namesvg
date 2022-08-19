import express from "express";
import compression from "compression";
import { renderPage } from "vite-plugin-ssr";
import { generatePreview } from "../services/randomImage";
import { getSeed, setRandomSeed, setSeed } from "../services/numberGeneration";
import { computeFace } from "../services/asset";

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  app.use(compression());

  if (isProduction) {
    const sirv = require("sirv");
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = require("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: "ssr" },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.post("/api/image/:name", async (req, res) => {
    // get name from query string
    const name = req.params.name as string;
    console.log(`Generating image for ${name}`);
    await setSeed(name);
    const preview = await computeFace();
    res.json(preview);
  });

  app.post("/api/random", async (req, res) => {
    // get name from query string
    await setRandomSeed();
    const preview = await computeFace();
    res.json(preview);
  });

  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3500;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
