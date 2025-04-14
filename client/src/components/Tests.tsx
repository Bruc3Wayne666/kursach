// Tests.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTests } from '../redux/testSlice';
import { RootState } from '../redux/store';
import { Link } from 'react-router-dom';

const Tests: React.FC = () => {
    const dispatch = useDispatch();
    const { tests, loading, error } = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        dispatch(fetchTests());
    }, [dispatch]);

    return (
        <div>
            <h1>Раздел Тестов</h1>
            {loading && <p>Загрузка тестов...</p>}
            {error && <p>Ошибка: {error}</p>}
            <ul>
                {tests.map(test => (
                    <li key={test.id}>
                        <Link to={`/test/${test.id}`}>
                            <h2>{test.title}</h2>
                        </Link>
                        <p>Тип: {test.type}</p>
                        <p>Описание: {test.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tests;
