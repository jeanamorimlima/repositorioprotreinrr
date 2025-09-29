import * as functions from "firebase-functions";
import next from "next";
import * as path from "path";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const nextjsDistDir = path.resolve(__dirname, "../../.next"); // build na raiz

const app = next({ dev, conf: { distDir: nextjsDistDir } });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req: express.Request, res: express.Response) => {
    return handle(req, res);
  });

  exports.nextServer = functions.https.onRequest(server);
});
