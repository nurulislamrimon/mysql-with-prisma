import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const app = express();
const port = 5000;

const prisma = new PrismaClient();

async function main() {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });
}

// call the main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// handle SIGINT and SIGTERM signals for graceful termination
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
  process.exit(0);
});
