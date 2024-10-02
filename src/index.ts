import { Prisma, PrismaClient } from "@prisma/client";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";

// create server
const app = express();
const port = process.env.port ?? 5000;

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
  app.get("/users", async (req: Request, res: Response) => {
    const result = await prisma.user.findMany();

    res.json(result);
    console.log(result);
    console.log(req.originalUrl);
  });

  // ======================== add user ========================
  app.post(
    "/users/add",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(req.body);

        const result = await prisma.user.create({
          data: req.body,
        });

        res.json(result);
        console.log(result);
      } catch (error) {
        next(error);
      }
    }
  );

  // ======================== error handler ========================
  // ======================== error handler middleware ========================
  app.use(
    ((err: any, req: Request, res: Response, next: NextFunction) => {
      // Check if it's a known Prisma error
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return res.status(400).json({
            status: "error",
            message: "Unique constraint failed. The record already exists.",
          });
        }
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          status: "error",
          message: "Prisma validation error: " + err.message,
        });
      }

      // Handle generic errors
      res.status(500).json({
        status: "error",
        message: err.message || "Internal server error",
      });
    }) as ErrorRequestHandler // Cast to ErrorRequestHandler to match the expected type
  );
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
