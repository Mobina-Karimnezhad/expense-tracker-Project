// backend/server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- داده‌های موقت (در حافظه) ---
let users = []; // دیگر از اول پر نیست!
let expenses = [];

// --- توابع کمکی برای محاسبات ---

const calculateBalances = () => {
    const balances = {};
    // اگر کاربری وجود نداشت، یک آبجکت خالی برگردان
    if (users.length === 0) {
        return balances;
    }
    users.forEach(user => balances[user] = 0);

    expenses.forEach(expense => {
        const { payer, amount } = expense;
        const sharePerPerson = amount / users.length;

        balances[payer] += amount;
        users.forEach(user => {
            balances[user] -= sharePerPerson;
        });
    });

    return balances;
};

const simplifyBalances = (balances) => {
    const debtors = [];
    const creditors = [];

    for (const user in balances) {
        const balance = balances[user];
        if (balance < 0) debtors.push({ name: user, amount: -balance });
        if (balance > 0) creditors.push({ name: user, amount: balance });
    }

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amountToPay = Math.min(debtor.amount, creditor.amount);

        settlements.push(`${debtor.name} باید به ${creditor.name} ${amountToPay.toLocaleString('fa-IR')} تومان بدهد.`);

        debtor.amount -= amountToPay;
        creditor.amount -= amountToPay;

        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;
    }

    return settlements;
};


// --- API Endpoints ---

// 1. مدیریت کاربران
// GET: دریافت لیست کاربران
app.get('/api/users', (req, res) => {
    res.json(users);
});

// POST: افزودن کاربر جدید
app.post('/api/users', (req, res) => {
    const { name } = req.body;
    if (!name || users.includes(name)) {
        return res.status(400).json({ error: 'نام نامعتبر است یا تکراری است.' });
    }
    users.push(name);
    res.status(201).json({ message: `کاربر ${name} اضافه شد.`, users });
});

// DELETE: حذف کاربر
app.delete('/api/users/:name', (req, res) => {
    const { name } = req.params;
    if (!users.includes(name)) {
        return res.status(404).json({ error: 'کاربر یافت نشد.' });
    }
    users = users.filter(user => user !== name);
    // حذف هزینه‌های مرتبط با کاربر حذف شده (اختیاری ولی منطقی)
    expenses = expenses.filter(expense => expense.payer !== name);
    res.json({ message: `کاربر ${name} حذف شد.`, users });
});


// 2. مدیریت هزینه‌ها
// GET: دریافت وضعیت حساب‌ها
app.get('/api/balance', (req, res) => {
    const balances = calculateBalances();
    const settlements = simplifyBalances(balances);
    res.json({ balances, settlements });
});

// POST: ثبت هزینه جدید
app.post('/api/expense', (req, res) => {
    const { payer, amount, description } = req.body;

    if (!payer || !amount || !users.includes(payer) || users.length === 0) {
        return res.status(400).json({ error: 'اطلاعات نامعتبر است. ابتدا مطمئن شوید کاربرانی وجود دارند.' });
    }

    const newExpense = {
        id: expenses.length + 1,
        payer,
        amount: parseFloat(amount),
        description: description || 'هزینه بدون توضیح',
        date: new Date().toISOString(),
    };

    expenses.push(newExpense);

    const balances = calculateBalances();
    const settlements = simplifyBalances(balances);

    res.status(201).json({ message: 'هزینه با موفقیت ثبت شد.', balances, settlements });
});

// --- شروع سرور ---
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});