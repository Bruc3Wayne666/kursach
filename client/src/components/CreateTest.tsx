import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  createTest } from '../redux/testSlice.ts'; // Adjust the import according to your file structure
import {  fetchQuestionsAsync } from '../redux/questionSlice.ts'; // Adjust the import according to your file structure

const CreateTest = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state) => state.questions);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

    useEffect(() => {
        dispatch(fetchQuestionsAsync());
    }, [dispatch]);

    const handleQuestionToggle = (questionId: number) => {
        setSelectedQuestions((prev) =>
            prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
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
        setSelectedQuestions([]);
    };

    return (
        <div>
            <h1>Создать тест</h1>
            {loading && <p>Загрузка вопросов...</p>}
            {error && <p>Ошибка: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название теста:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Описание теста:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Тип теста:</label>
                    <textarea value={type} onChange={(e) => setType(e.target.value)} required />
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    <label>Выберите вопросы:</label>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {questions.map((question) => (
                            <li
                                key={question.id}
                                onClick={() => handleQuestionToggle(question.id)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedQuestions.includes(question.id) ? '#555' : '#222',
                                    marginBottom: '5px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                {question.question}
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Создать тест</button>
            </form>
        </div>
    );
};

export default CreateTest;
