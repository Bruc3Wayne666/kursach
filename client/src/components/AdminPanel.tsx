// AdminPanel.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Админ Панель</h2>
            <button onClick={() => navigate('/create_test')}>Создать тест</button> {/* Кнопка для перехода к созданию теста */}
            <button onClick={() => navigate('/add_question')}>Создать вопрос</button> {/* Кнопка для управления тестами */}
            {/* Здесь можно добавить другие кнопки или элементы для администрирования */}
        </div>
    );
};

export default AdminPanel;
