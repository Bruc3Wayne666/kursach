import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTest } from '../redux/testSlice';
import { fetchQuestionsAsync } from '../redux/questionSlice';
import './CreateTest.css';

const CreateTest = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state: any) => state.questions);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [selectedPsychotype, setSelectedPsychotype] = useState<number | null>(null);

    const psychotypeNames: { [key: number]: string } = {
        1: 'ПАРАНОИК',
        2: 'ЭПИЛЕПТОИД',
        3: 'ГИПЕРТИМ',
        4: 'ИСТЕРОИД',
        5: 'ШИЗОИД',
        6: 'ПСИХАСТЕНОИД',
        7: 'СЕНЗИТИВ',
        8: 'ГИПОТИМ',
        9: 'КОНФОРМНЫЙ ТИП',
        10: 'НЕУСТОЙЧИВЫЙ ТИП',
        11: 'АСТЕНИК',
        12: 'ЛАБИЛЬНЫЙ ТИП',
        16: 'ЦИКЛОИД'
    };

    useEffect(() => {
        dispatch(fetchQuestionsAsync());
    }, [dispatch]);

    const handleQuestionToggle = (questionId: number) => {
        setSelectedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTest = {
            title,
            description,
            questionIds: selectedQuestions,
            type,
        };
        dispatch(createTest(newTest));
        // Reset form
        setTitle('');
        setDescription('');
        setType('');
        setSelectedQuestions([]);
        setSelectedPsychotype(null);
    };

    // Группировка вопросов по PsychotypeId
    const groupedQuestions = questions.reduce((acc: { [key: number]: any[] }, question: any) => {
        const psychotypeId = question.PsychotypeId;
        if (!acc[psychotypeId]) {
            acc[psychotypeId] = [];
        }
        acc[psychotypeId].push(question);
        return acc;
    }, {});

    // Получаем список всех психотипов для фильтра
    const psychotypeList = Object.keys(groupedQuestions)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div className="create-test-container">
            <h1>Создать тест</h1>
            {loading && <p className="loading">Загрузка вопросов...</p>}
            {error && <p className="error">Ошибка: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Название теста:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Введите название теста"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Описание теста:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Введите описание теста"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Тип теста:</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="">Выберите тип теста</option>
                        <option value="small">small</option>
                        <option value="large">large</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="psychotype-filter">Фильтр по психотипу:</label>
                    <select
                        id="psychotype-filter"
                        value={selectedPsychotype || ''}
                        onChange={(e) => setSelectedPsychotype(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">Все психотипы</option>
                        {psychotypeList.map((psychotypeId) => (
                            <option key={psychotypeId} value={psychotypeId}>
                                {psychotypeNames[psychotypeId] || `Психотип ${psychotypeId}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group questions-list">
                    <label>Выберите вопросы:</label>
                    {Object.keys(groupedQuestions).length === 0 && !loading && (
                        <p>Вопросы не найдены.</p>
                    )}

                    {psychotypeList
                        .filter(psychotypeId =>
                            selectedPsychotype === null || psychotypeId === selectedPsychotype
                        )
                        .map((psychotypeId) => (
                            <div key={psychotypeId} className="psychotype-section">
                                <h3>
                                    {groupedQuestions[psychotypeId][0]?.psychotype?.name ||
                                        psychotypeNames[psychotypeId] ||
                                        `Психотип ${psychotypeId}`}
                                </h3>
                                <ul>
                                    {groupedQuestions[psychotypeId].map((question: any) => (
                                        <li
                                            key={question.id}
                                            onClick={() => handleQuestionToggle(question.id)}
                                            className={selectedQuestions.includes(question.id) ? 'selected' : ''}
                                        >
                                            {question.question}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>

                <button type="submit">Создать тест</button>
            </form>
        </div>
    );
};

export default CreateTest;
