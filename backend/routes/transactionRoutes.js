const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");

// GET all transactions
router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user
        });
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST a new transaction

router.post("/", async (req, res) => {
    try {
        const { title, amount, type, category, date, description } = req.body;

        // Check required fields
        if (!title || amount === undefined || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, amount, type and category"
            });
        }

        // Validate amount
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }

        // Validate transaction type
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be income or expense"
            });
        }

        const transaction = await Transaction.create({
            userId: req.user,
            title,
            amount,
            type,
            category,
            date,
            description
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// PUT - Update a transaction
router.put("/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
    {
        _id: req.params.id,
        userId: req.user
    },
    req.body,
    {
        new: true,
        runValidators: true
    }
);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

 // DELETE - Delete a transaction
router.delete("/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user
});

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
            data: transaction
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// GET transaction summary
router.get("/summary", async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
    {
        $match: {
            userId: new mongoose.Types.ObjectId(req.user)
        }
    },
    {
        $group: {
                    _id: null,

                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "income"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalExpenses: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "expense"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const totalIncome = summary[0]?.totalIncome || 0;
        const totalExpenses = summary[0]?.totalExpenses || 0;

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
