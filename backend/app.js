require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation"));
    },
    credentials: true
  })
);



app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy"
  });
});


const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);



const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected via Prisma");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();


process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});