import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, register} from '../redux/authSlice';
import {RootState} from '../redux/store';

const Auth: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const dispatch = useDispatch();
    const authStatus = useSelector((state: RootState) => state.auth.status);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isRegistering) {
            dispatch(register({username, password}));
        } else {
            dispatch(login({username, password}));
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Регистрация' : 'Вход'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={authStatus === 'loading'}>
                    {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                        </button>
                        </form>
                        <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </button>
        </div>
    );
};

export default Auth;
