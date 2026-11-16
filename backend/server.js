const dns = require("node:dns");
const Transaction = require("./models/Transaction");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to SpendWise API!");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SpendWise server is running!"
    });
});
// app.post("/api/test-transaction", async (req, res) => {
//     try {
//         const transaction = await Transaction.create({
//             title: "College lunch",
//             amount: 250,
//             type: "expense",
//             category: "Food",
//             description: "Testing SpendWise database"
//         });

//         res.status(201).json({
//             success: true,
//             message: "Transaction created successfully",
//             data: transaction
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });
// Connect database first, then start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();