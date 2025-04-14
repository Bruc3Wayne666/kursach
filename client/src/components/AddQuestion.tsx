// src/components/AddQuestion.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestionAsync } from '../redux/questionSlice'; // Импортируйте асинхронное действие

const AddQuestion: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newQuestion = {
            topic,
            questionText,
            correctAnswer: correctAnswer === 'ДА',
        };

        try {
            await dispatch(addQuestionAsync(newQuestion)) // Используем unwrap для обработки ошибок
            alert('Вопрос успешно создан!');
            setTopic('');
            setQuestionText('');
            setCorrectAnswer('');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось создать вопрос. Попробуйте еще раз.');
        }
    };

    return (
        <div>
            <h1>Создание нового вопроса</h1>
            <form onSubmit={handleSubmit}>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} required>
                    <option value="">Выберите тематику</option>
                    <option value="ПАРАНОИК">ПАРАНОИК</option>
                    <option value="ЭПИЛЕПТОИД">ЭПИЛЕПТОИД</option>
                    <option value="ГИПЕРТИМ">ГИПЕРТИМ</option>
                    <option value="ИСТЕРОИД">ИСТЕРОИД</option>
                    <option value="ШИЗОИД">ШИЗОИД</option>
                    <option value="ПСИХАСТЕНОИД">ПСИХАСТЕНОИД</option>
                    <option value="СЕНЗИТИВ">СЕНЗИТИВ</option>
                    <option value="ГИПОТИМ">ГИПОТИМ</option>
                    <option value="КОНФОРМНЫЙ ТИП">КОНФОРМНЫЙ ТИП</option>
                    <option value="НЕУСТОЙЧИВЫЙ ТИП">НЕУСТОЙЧИВЫЙ ТИП</option>
                    <option value="АСТЕНИК">АСТЕНИК</option>
                    <option value="ЛАБИЛЬНЫЙ ТИП">ЛАБИЛЬНЫЙ ТИП</option>
                    <option value="ЦИКЛОИД">ЦИКЛОИД</option>
                </select>
                <input
                    type="text"
                    placeholder="Текст вопроса"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
                <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required>
                    <option value="">Выберите правильный ответ</option>
                    <option value="ДА">ДА</option>
                    <option value="НЕТ">НЕТ</option>
                </select>
                <button type="submit">Добавить вопрос</button>
            </form>
        </div>
    );
};

export default AddQuestion;
