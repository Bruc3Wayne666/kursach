// Home.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Инициализируем navigate

    const handleNavigateTo = (path: string) => {
        navigate('/' + path); // Переход к разделу тестов
    };

    return (
        <div>
            <h1>Добро пожаловать, {user?.username}!</h1>
            <button onClick={() => dispatch(logout())}>Выйти</button>
            <button onClick={() => handleNavigateTo('tests')}>Перейти к тестам</button> {/* Кнопка для перехода */}
            <button onClick={() => handleNavigateTo('admin_panel')}>Админ Панель</button> {/* Кнопка для перехода */}
        </div>
    );
};

export default Home;
