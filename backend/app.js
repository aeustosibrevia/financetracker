const express = require("express");
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({status: "ok"});
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((req, res) => {
    res.status(404).json({message: "Not found"});
});

app.use((err, req, res, next) => {
    const status = err.status || 500;

    if (status === 500) {
        console.error(err);
    }

    res.status(status).json({
        message: status === 500 ? "Server error" : err.message,
    });
});

module.exports = app;
