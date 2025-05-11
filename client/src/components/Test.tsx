import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTestDetails, fetchTestQuestions, submitTestResults, fetchReport } from '../redux/testSlice';
import { RootState } from '../redux/store';
import { Card, Progress, Button, Typography, Radio, Space, Modal, Spin, message } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    ArrowRightOutlined,
    FileTextOutlined,
    HomeOutlined
} from '@ant-design/icons';
import './Test.css';

const { Title, Text } = Typography;

const Test: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { test, loading, error, questions, report } = useSelector((state: RootState) => state.tests);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchTestDetails(id!));
        dispatch(fetchTestQuestions(id!));
    }, [dispatch, id]);

    const handleAnswerSelect = (answer: boolean) => {
        setUserAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex].id]: answer
        }));
    };

    const moveToNextQuestion = () => {
        if (userAnswers[questions[currentQuestionIndex].id] === undefined) {
            message.warning('Пожалуйста, выберите ответ');
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            submitTestAnswers();
        }
    };

    const submitTestAnswers = async () => {
        setIsSubmitting(true);
        try {
            const answers = Object.entries(userAnswers).map(([questionId, answer]) => ({
                test_id: id,
                question_id: Number(questionId),
                user_id: 1, // TODO: Заменить на реальный ID пользователя
                user_answer: answer
            }));

            await dispatch(submitTestResults(answers));
            await dispatch(fetchReport(id!));
            setIsReportVisible(true);
            message.success('Тест успешно завершен!');
        } catch (err) {
            console.error('Ошибка:', err);
            message.error('Ошибка при отправке результатов');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeReport = () => {
        setIsReportVisible(false);
        navigate('/');
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    const hasAnswer = userAnswers[currentQuestion?.id] !== undefined;

    if (loading) return (
        <div className="loading-container">
            <Spin size="large" tip="Загрузка теста..." />
        </div>
    );

    if (error) return (
        <Alert
            type="error"
            message="Ошибка загрузки"
            description={error}
            showIcon
            closable
            className="error-alert"
        />
    );

    return (
        <div className="test-page">
            {questions.length > 0 && (
                <Card className="test-card">
                    <div className="test-header">
                        <Title level={4} className="test-title">
                            <FileTextOutlined /> {test?.title || 'Тест'}
                        </Title>
                        <Progress percent={progress} showInfo={false} strokeColor="#1890ff" />
                        <Text type="secondary">
                            Вопрос {currentQuestionIndex + 1} из {questions.length}
                        </Text>
                    </div>

                    <div className="question-content">
                        <Title level={5} className="question-text">
                            {currentQuestion.question}
                        </Title>

                        <Radio.Group
                            onChange={(e) => handleAnswerSelect(e.target.value)}
                            value={userAnswers[currentQuestion.id]}
                            className="answer-group"
                        >
                            <Space direction="vertical">
                                <Radio value={true} className="answer-option">
                                    <CheckOutlined /> Верно
                                </Radio>
                                <Radio value={false} className="answer-option">
                                    <CloseOutlined /> Неверно
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </div>

                    <div className="test-footer">
                        <Button
                            type="primary"
                            size="large"
                            onClick={moveToNextQuestion}
                            loading={isSubmitting}
                            icon={<ArrowRightOutlined />}
                            disabled={!hasAnswer}
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Далее' : 'Завершить тест'}
                        </Button>
                    </div>
                </Card>
            )}

            <Modal
                title="Результаты тестирования"
                open={isReportVisible}
                onCancel={closeReport}
                footer={[
                    <Button
                        key="home"
                        type="primary"
                        onClick={closeReport}
                        icon={<HomeOutlined />}
                    >
                        На главную
                    </Button>
                ]}
                width={800}
                centered
            >
                {report?.responseText?.content ? (
                    <div
                        style={{backgroundColor: 'white'}}
                        className="report-content"
                        dangerouslySetInnerHTML={{ __html: report.responseText.content }}
                    />
                ) : (
                    <Spin tip="Формирование отчета..." />
                )}
            </Modal>
        </div>
    );
};

export default Test;
