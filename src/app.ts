import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import routes from "./routes/v1/index";
import { Request, Response, NextFunction } from "express";
import { limiter } from "./middlewares/rateLimiter";
import cookieParser from "cookie-parser";

export const app = express();

var whitelist = ["https://dirfrontend.netlify.app", "http://localhost:3000"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    // Allow requests with no origin ( like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authorization header
};

app
  .use(limiter)
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors(corsOptions))
  .use(helmet())
  .use(compression())
  .use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use(express.static("uploads"));

app.use(routes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Server Error";
  const errorCode = error.code || "Error_Code";
  res.status(status).json({ message, error: errorCode });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});
