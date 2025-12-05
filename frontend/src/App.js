// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import BalanceDashboard from './components/BalanceDashboard';
import UserManager from './components/UserManager'; // کامپوننت جدید را وارد کن
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [balances, setBalances] = useState({});
    const [settlements, setSettlements] = useState([]);

    // تابعی برای گرفتن لیست کاربران از بک‌اند
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // تابعی برای گرفتن وضعیت ترازها
    const fetchBalance = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/balance');
            setBalances(response.data.balances);
            setSettlements(response.data.settlements);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // با بارگذاری کامپوننت، لیست کاربران و ترازها را دریافت کن
    useEffect(() => {
        fetchUsers();
        fetchBalance();
    }, []);

    // توابعی برای به‌روزرسانی پس از افزودن/حذف کاربر
    const handleUserAdded = () => {
        fetchUsers();
        fetchBalance(); // با اضافه شدن کاربر جدید، ترازها هم باید ریست شوند
    };

    const handleUserDeleted = () => {
        fetchUsers();
        fetchBalance(); // با حذف کاربر، هزینه‌ها و ترازها تغییر می‌کنند
    };

    const handleExpenseAdded = (newBalances, newSettlements) => {
        setBalances(newBalances);
        setSettlements(newSettlements);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>اپلیکیشن تقسیم هزینه</h1>
            </header>
            <main>
                <UserManager 
                    users={users} 
                    onUserAdded={handleUserAdded} 
                    onUserDeleted={handleUserDeleted} 
                />
                <ExpenseForm onExpenseAdded={handleExpenseAdded} users={users} />
                <BalanceDashboard 
                    balances={balances} 
                    settlements={settlements} 
                    users={users} 
                />
            </main>
        </div>
    );
}

export default App;