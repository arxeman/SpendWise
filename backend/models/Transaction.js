
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
         userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        
        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        type: {
            type: String,
            required: true,
            enum: ["income", "expense"]
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
