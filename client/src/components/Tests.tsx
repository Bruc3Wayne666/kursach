import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTests } from '../redux/testSlice';
import { RootState } from '../redux/store';
import { Link } from 'react-router-dom';
import { Card, Space, Typography, Button, Skeleton, Tag, Alert } from 'antd';
import {
    RocketOutlined,
    FileTextOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import './Tests.css';

const { Title, Text } = Typography;

const Tests: React.FC = () => {
    const dispatch = useDispatch();
    const { tests, loading, error } = useSelector((state: RootState) => state.tests);

    useEffect(() => {
        dispatch(fetchTests());
    }, [dispatch]);

    const getTestTypeTag = (type: string) => {
        switch(type) {
            case 'small':
                return <Tag icon={<ClockCircleOutlined />} color="blue">Быстрый тест</Tag>;
            case 'large':
                return <Tag icon={<FileTextOutlined />} color="purple">Полный тест</Tag>;
            default:
                return <Tag color="default">{type}</Tag>;
        }
    };

    return (
        <div className="tests-container">
            <div className="tests-header">
                <Title level={2} className="tests-title">
                    <RocketOutlined /> Доступные тесты
                </Title>
                <Text type="secondary">Выберите тест для определения психотипа</Text>
            </div>

            {error && (
                <Alert
                    message="Ошибка загрузки"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    className="error-alert"
                />
            )}

            {loading ? (
                <div className="tests-grid">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="test-skeleton">
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="tests-grid">
                    {tests.map((test: any) => (
                        <Card
                            key={test.id}
                            className="test-card"
                            hoverable
                            actions={[
                                <Link to={`/test/${test.id}`}>
                                    <Button type="primary" icon={<ArrowRightOutlined />}>
                                        Начать тест
                                    </Button>
                                </Link>
                            ]}
                        >
                            <div className="test-card-content">
                                <Title level={4} className="test-title">
                                    {test.title}
                                </Title>
                                <div className="test-meta">
                                    {getTestTypeTag(test.type)}
                                </div>
                                <Text className="test-description">
                                    {test.description}
                                </Text>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tests;
