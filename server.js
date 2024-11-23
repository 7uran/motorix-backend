const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db/dbserver");
const teamRouter = require("./routers/TeamRouter");
const authRouter = require("./routers/AuthRouter");
const blogRouter = require("./routers/BlogRouter");
const shopCardRouter = require("./routers/Shoprouter");
const path = require("path");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

const PORT = process.env.PORT || 8080;

app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/shopCards", shopCardRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
