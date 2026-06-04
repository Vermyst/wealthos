const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const { execSync } = require("child_process");
if (process.env.NODE_ENV === "production") {
  try {
    execSync("chmod +x " + path.join(__dirname, "utils/debt_optimizer_linux"));
  } catch (e) {
    console.log("chmod failed:", e.message);
  }
}

const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Make io accessible in controllers
app.set("io", io);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.get("/", (req, res) => res.send("WealthOS API running"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/debts", require("./routes/debtRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
