// ===============================
// FINWISE BACKEND SERVER
// Node.js + Express + MongoDB
// ===============================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect('mongodb://127.0.0.1:27017/finwise')
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log(err));

// ===============================
// User Schema
// ===============================

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// ===============================
// Transaction Schema
// ===============================

const transactionSchema = new mongoose.Schema({
    userId: String,

    type: {
        type: String,
        enum: ['income', 'expense']
    },

    category: String,

    amount: Number,

    description: String,

    date: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// ===============================
// REGISTER API
// ===============================

app.post('/register', async (req, res) => {

    try {

        const user = await User.create(req.body);

        res.status(201).json({
            message: 'User Registered Successfully',
            user
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// LOGIN API
// ===============================

app.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {

            return res.status(400).json({
                message: 'Invalid Email or Password'
            });

        }

        res.json({
            message: 'Login Successful',
            user
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// ADD TRANSACTION API
// ===============================

app.post('/add-transaction', async (req, res) => {

    try {

        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            message: 'Transaction Added',
            transaction
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// GET ALL TRANSACTIONS
// ===============================

app.get('/transactions', async (req, res) => {

    try {

        const transactions = await Transaction.find();

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// DELETE TRANSACTION
// ===============================

app.delete('/delete-transaction/:id', async (req, res) => {

    try {

        await Transaction.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Transaction Deleted Successfully'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// UPDATE TRANSACTION
// ===============================

app.put('/update-transaction/:id', async (req, res) => {

    try {

        const updatedTransaction =
        await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTransaction);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// FINANCIAL SUMMARY API
// ===============================

app.get('/summary', async (req, res) => {

    try {

        const transactions = await Transaction.find();

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(t => {

            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }

        });

        const balance = totalIncome - totalExpense;

        res.json({
            totalIncome,
            totalExpense,
            balance
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// ===============================
// SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(`FinWise Backend Running on Port ${PORT}`);

});