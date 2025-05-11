// AdminPanel.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'; // Импортируем файл стилей

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-panel-container">
            <h2>Админ Панель</h2>
            <div className="button-container">
                <button onClick={() => navigate('/create_test')} className="admin-button">Создать тест</button>
                <button onClick={() => navigate('/add_question')} className="admin-button">Создать вопрос</button>
                {/* Здесь можно добавить другие кнопки или элементы для администрирования */}
            </div>
        </div>
    );
};

export default AdminPanel;
