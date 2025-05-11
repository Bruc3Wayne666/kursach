import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchReports } from '../redux/reportsSlice';
import { RootState } from '../redux/store';
import { Card, List, Typography, Button, Space, Spin, Alert, Tag } from 'antd';
import { FileTextOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './ReportsPage.css';

const { Title, Text } = Typography;

interface Report {
    id: number;
    testTitle: string;
    reportContent: string;
    createdAt: string;
    testType: string;
}

const ReportsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { reports, loading, error } = useSelector((state: RootState) => state.reports);

    useEffect(() => {
        dispatch(fetchReports(1)); // Replace with actual user ID
    }, [dispatch]);

    const getPreviewText = (content: string) => {
        try {
            // Try to extract text content from JSON if exists
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                const jsonContent = JSON.parse(jsonMatch[1]);
                return jsonContent.summary || jsonContent.description || 'Отчет доступен для просмотра';
            }
            return content.length > 100
                ? content.slice(0, 100) + '...'
                : content;
        } catch (e) {
            return content.length > 100
                ? content.slice(0, 100) + '...'
                : content;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Загрузка отчетов..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message="Ошибка загрузки"
                description={error}
                showIcon
                closable
                className="error-alert"
            />
        );
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <Title level={2} className="page-title">
                    <FileTextOutlined /> Мои отчеты
                </Title>
                <Text type="secondary">История пройденных тестов и результаты</Text>
            </div>

            <List
                itemLayout="vertical"
                size="large"
                dataSource={reports}
                renderItem={(report: Report) => (
                    <List.Item key={report.id} className="report-item">
                        <Card className="report-card">
                            <div className="report-content" style={{backgroundColor: 'white'}}>
                                <div className="report-meta">
                                    <Title level={4} className="report-title">
                                        {report.testTitle}
                                    </Title>
                                    <Space size={[8, 16]} wrap>
                                        <Tag color={report.testType === 'small' ? 'blue' : 'purple'}>
                                            {report.testType === 'small' ? 'Быстрый тест' : 'Полный тест'}
                                        </Tag>
                                        <Text type="secondary">{formatDate(report.createdAt)}</Text>
                                    </Space>
                                </div>

                                <Text className="report-preview">
                                    {getPreviewText(report.reportContent)}
                                </Text>

                                <div className="report-actions">
                                    <Link to={`/report/${report.id}`} state={{ report }}>
                                        <Button
                                            type="primary"
                                            icon={<ArrowRightOutlined />}
                                        >
                                            Подробнее
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ReportsPage;
