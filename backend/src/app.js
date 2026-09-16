import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allows requests only from the frontend origin defined in .env.
// credentials:true is required for cookies to be sent cross-origin.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));          // parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // parse form data
app.use(express.static("public"));                 // serve files from /public
app.use(cookieParser());                           // parse httpOnly cookies

// ─── Routes ───────────────────────────────────────────────────────────────────
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Express recognises a 4-argument middleware as an error handler.
// Any controller that throws an ApiError (or any Error) lands here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
