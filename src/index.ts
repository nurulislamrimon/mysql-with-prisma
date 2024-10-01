import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";

// create server
const app = express();
const port = 5000;

// create query handler prisma client
const prisma = new PrismaClient();

// handle cors
app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to MySql - API!");
    console.log(req.originalUrl);
  });

  // ======================== get users ========================
  app.get("/user", async (req: Request, res: Response) => {
    const result = await prisma.user.findMany();

    console.log(result);

    res.json(result);
    console.log(req.originalUrl);
  });

  // ======================== add user ========================
  app.post("/user/add", async (req: Request, res: Response) => {
    const result = await prisma.user.create({
      data: req.body,
    });

    console.log(result);

    res.json(result);
    console.log(req.originalUrl);
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
