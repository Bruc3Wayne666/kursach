import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTestDetails, fetchTestQuestions, submitTestResults } from '../redux/testSlice';
import { RootState } from '../redux/store';

const Test: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { test, loading, error, questions } = useSelector((state: RootState) => state.tests);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: boolean | null }>({});
    const [submitting, setSubmitting] = useState(false); // State for submission loading

    useEffect(() => {
        dispatch(fetchTestDetails(id));
        dispatch(fetchTestQuestions(id));
    }, [dispatch, id]);

    const handleAnswerChange = (answer: boolean | null) => {
        setUserAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex].id]: answer,
        }));
    };

    const handleNextQuestion = () => {
        // Check if the current question has been answered
        if (userAnswers[questions[currentQuestionIndex].id] === undefined) {
            alert('Пожалуйста, выберите ответ перед переходом к следующему вопросу.');
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            submitResults();
        }
    };

    const submitResults = async () => {
        setSubmitting(true); // Set submitting to true
        try {
            const results = Object.entries(userAnswers).map(([questionId, userAnswer]) => ({
                test_id: id,
                question_id: Number(questionId),
                user_id: 1, // Replace with actual user ID
                user_answer: userAnswer,
            }));

            // Dispatch the action to submit results
            await dispatch(submitTestResults(results));

            alert('Ваши ответы успешно сохранены!');
            // Optionally, redirect or reset the state here
        } catch (error) {
            console.error('Ошибка при сохранении результатов:', error);
            alert('Произошла ошибка при сохранении результатов.');
        } finally {
            setSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div>
            {loading && <p>Загрузка теста...</p>}
            {error && <p>Ошибка: {error}</p>}
            {questions.length > 0 && (
                <div>
                    <h1>{`Тест: ${test?.title}`}</h1>
                    <h2>{`Вопрос ${currentQuestionIndex + 1} из ${questions.length}`}</h2>
                    <p>{questions[currentQuestionIndex].question}</p>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="answer"
                                value="true"
                                checked={userAnswers[questions[currentQuestionIndex].id] === true}
                                onChange={() => handleAnswerChange(true)}
                            />
                            Верно
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="answer"
                                value="false"
                                checked={userAnswers[questions[currentQuestionIndex].id] === false}
                                onChange={() => handleAnswerChange(false)}
                            />
                            Неверно
                        </label>
                    </div>
                    <button onClick={handleNextQuestion} disabled={submitting}>
                        {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Отправить ответы'}
                    </button>
                    {submitting && <p>Отправка ваших ответов...</p>} {/* Loading message during submission */}
                </div>
            )}
        </div>
    );
};

export default Test;
