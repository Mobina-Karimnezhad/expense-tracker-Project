// src/components/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = ({ onExpenseAdded, users }) => {
    const [payer, setPayer] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // هر زمان که لیست کاربران تغییر کرد، اگر پرداخت‌کننده قبلی در لیست نبود، اولین کاربر را انتخاب کن
    useEffect(() => {
        if (users.length > 0 && !users.includes(payer)) {
            setPayer(users[0]);
        }
    }, [users, payer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            alert('مبلغ را به درستی وارد کنید.');
            return;
        }
        if (!payer) {
            alert('لطفاً یک پرداخت‌کننده انتخاب کنید.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/expense', {
                payer,
                amount: parseFloat(amount),
                description,
            });

            onExpenseAdded(response.data.balances, response.data.settlements);
            setAmount('');
            setDescription('');

        } catch (error) {
            alert(error.response.data.error || 'خطا در ثبت هزینه.');
        }
    };

    // اگر کاربری وجود ندارد، فرم را نمایش نده
    if (users.length === 0) {
        return <p className="warning">برای ثبت هزینه، ابتدا اعضای گروه را اضافه کنید.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <h3>ثبت هزینه جدید</h3>
            <div className="form-group">
                <label>پرداخت‌کننده:</label>
                <select value={payer} onChange={(e) => setPayer(e.target.value)}>
                    {users.map(user => <option key={user} value={user}>{user}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>مبلغ (تومان):</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>توضیحات:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit">ثبت هزینه</button>
        </form>
    );
};

export default ExpenseForm;