// src/components/BalanceDashboard.js
import React from 'react';

const BalanceDashboard = ({ balances, settlements, users }) => {
    // اگر کاربری وجود ندارد، چیزی نمایش نده
    if (users.length === 0) {
        return null;
    }

    // اگر هزینه‌ای ثبت نشده (یعنی همه ترازها صفر است)
    const allBalancesAreZero = Object.values(balances).every(balance => balance === 0);

    return (
        <div className="dashboard">
            <h3>وضعیت حساب‌ها</h3>
            {allBalancesAreZero ? (
                <p>هزینه‌ای برای محاسبه وجود ندارد.</p>
            ) : (
                <div className="balances">
                    {Object.entries(balances).map(([user, balance]) => (
                        <div key={user} className={`balance-item ${balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'zero'}`}>
                            <span>{user}:</span>
                            <span>{balance.toLocaleString('fa-IR')} تومان</span>
                        </div>
                    ))}
                </div>
            )}

            <h3>نحوه تسویه حساب</h3>
            <div className="settlements">
                {settlements.length > 0 ? (
                    <ul>
                        {settlements.map((settlement, index) => (
                            <li key={index}>{settlement}</li>
                        ))}
                    </ul>
                ) : (
                    <p>همه چیز تسویه است! 🎉</p>
                )}
            </div>
        </div>
    );
};

export default BalanceDashboard;