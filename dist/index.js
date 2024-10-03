"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// create server
const app = (0, express_1.default)();
const port = (_a = process.env.port) !== null && _a !== void 0 ? _a : 5000;
// create query handler prisma client
const prisma = new client_1.PrismaClient();
// handle cors
app.use((0, cors_1.default)());
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/", (req, res) => {
            res.send("Welcome to MySql - API!");
            console.log(req.originalUrl);
        });
        // ======================== get users ========================
        app.get("/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.user.findMany();
            res.json(result);
            console.log(result);
            console.log(req.originalUrl);
        }));
        // ======================== add user ========================
        app.post("/users/add", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const result = yield prisma.user.create({
                    data: req.body,
                });
                res.json(result);
                console.log(result);
            }
            catch (error) {
                next(error);
            }
        }));
        // ======================== error handler ========================
        // ======================== error handler middleware ========================
        app.use(((err, req, res, next) => {
            // Check if it's a known Prisma error
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    return res.status(400).json({
                        status: "error",
                        message: "Unique constraint failed. The record already exists.",
                    });
                }
            }
            else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
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
        }) // Cast to ErrorRequestHandler to match the expected type
        );
    });
}
// call the main function
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
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
