import React, { useState } from 'react';
import axios from 'axios';

const UserManager = ({ users, onUserAdded, onUserDeleted }) => {
    const [newUserName, setNewUserName] = useState('');

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        try {
            await axios.post('http://localhost:5000/api/users', { name: newUserName });
            onUserAdded(); // تابعی برای به‌روزرسانی لیست در App.js
            setNewUserName('');
        } catch (error) {
            alert(error.response.data.error || 'خطا در افزودن کاربر.');
        }
    };

    const handleDeleteUser = async (userName) => {
        if (!window.confirm(`آیا از حذف "${userName}" مطمئن هستید؟`)) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/users/${userName}`);
            onUserDeleted(); // تابعی برای به‌روزرسانی لیست در App.js
        } catch (error) {
            alert(error.response.data.error || 'خطا در حذف کاربر.');
        }
    };

    return (
        <div className="user-manager">
            <h3>مدیریت اعضا</h3>
            <form onSubmit={handleAddUser} className="add-user-form">
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="نام فرد جدید را وارد کنید..."
                    required
                />
                <button type="submit">افزودن عضو</button>
            </form>
            <div className="users-list">
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user}>
                                {user}
                                <button onClick={() => handleDeleteUser(user)} className="delete-user-btn">حذف</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>هنوز عضوی اضافه نشده است.</p>
                )}
            </div>
        </div>
    );
};

export default UserManager;