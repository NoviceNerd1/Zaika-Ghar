import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import restaurantRoute from "./routes/restaurant.route.js";
import menuRoute from "./routes/menu.route.js";
import orderRoute from "./routes/order.route.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIRNAME = path.resolve();

// --- Middleware ---
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- CORS setup ---
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "https://zaika-ghar.vercel.app", // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server / Postman requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // allow cookies/auth headers
  })
);

// Preflight requests
app.options("*", cors());

// --- Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// --- Static frontend (optional) ---
// app.use(express.static(path.join(DIRNAME, "/client/dist")));
// app.use("*", (_, res) => {
//   res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
// });

// --- Start server ---
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at port ${PORT}`);
});
