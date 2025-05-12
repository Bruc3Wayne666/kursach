import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Typography,
    Space,
    Avatar,
    Divider,
    Layout,
    theme,
    Row,
    Col,
    Statistic,
    Spin,
    List,
    Tag,
    Progress,
    Table,
    Alert,
    Tooltip
} from 'antd';
import {
    FileAddOutlined,
    QuestionCircleOutlined,
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    RocketOutlined,
    FileTextOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PieChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './AdminPanel.css';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

interface PsychotypeStat {
    id: number;
    name: string;
    count: number;
}

interface TestStat {
    type: string;
    count: number;
}

interface ActivityItem {
    id: number;
    title?: string;
    username?: string;
    createdAt: string;
    User?: { username: string };
    Test?: { title: string };
}

interface StatsData {
    summary: {
        totalQuestions: number;
        totalTests: number;
        totalUsers: number;
        activeUsers: number;
        completedTests: number;
    };
    questions: {
        totalQuestions: number;
        questionsByPsychotype: PsychotypeStat[];
    };
    tests: {
        totalTests: number;
        testsByType: TestStat[];
        avgQuestionsPerTest: string;
    };
    users: {
        totalUsers: number;
        activeUsers: number;
        completedTestsCount: number;
    };
    activity: {
        recentTests: ActivityItem[];
        recentUsers: ActivityItem[];
        recentResults: ActivityItem[];
    };
}

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const API_URL = 'http://localhost:3000';

                const [summary, questions, tests, users, activity] = await Promise.all([
                    axios.get(`${API_URL}/stats/summary`),
                    axios.get(`${API_URL}/stats/questions`),
                    axios.get(`${API_URL}/stats/tests`),
                    axios.get(`${API_URL}/stats/users`),
                    axios.get(`${API_URL}/stats/recent-activity`)
                ]);

                // Валидация структуры данных
                if (!summary.data?.data || !questions.data?.data || !tests.data?.data || !users.data?.data || !activity.data?.data) {
                    throw new Error('Неверная структура данных ответа');
                }

                setStats({
                    summary: summary.data.data,
                    questions: questions.data.data,
                    tests: tests.data.data,
                    users: users.data.data,
                    activity: activity.data.data
                });
            } catch (err) {
                console.error('Ошибка загрузки статистики:', err);
                setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const adminFeatures = [
        {
            title: 'Создать тест',
            icon: <FileAddOutlined className="feature-icon" />,
            action: () => navigate('/create_test'),
            color: '#1890ff',
            description: 'Создайте новый психологический тест'
        },
        {
            title: 'Добавить вопрос',
            icon: <QuestionCircleOutlined className="feature-icon" />,
            action: () => navigate('/add_question'),
            color: '#52c41a',
            description: 'Добавьте новые вопросы в базу'
        },
        {
            title: 'Управление тестами',
            icon: <DashboardOutlined className="feature-icon" />,
            action: () => navigate('/manage'),
            color: '#722ed1',
            description: 'Управление существующими тестами'
        },
        {
            title: 'Управление пользователями',
            icon: <UserOutlined className="feature-icon" />,
            action: () => navigate('/users'),
            color: '#fa8c16',
            description: 'Просмотр и управление пользователями'
        }
    ];

    const getPsychotypeColor = (name: string) => {
        const colors: Record<string, string> = {
            'ПАРАНОИК': '#ff4d4f',
            'ЭПИЛЕПТОИД': '#13c2c2',
            'ГИПЕРТИМ': '#1890ff',
            'ИСТЕРОИД': '#722ed1',
            'ШИЗОИД': '#fa8c16',
            'ПСИХАСТЕНОИД': '#52c41a',
            'СЕНЗИТИВ': '#eb2f96',
            'ГИПОТИМ': '#faad14',
            'КОНФОРМНЫЙ': '#2f54eb',
            'НЕУСТОЙЧИВЫЙ': '#a0d911',
            'АСТЕНИК': '#f5222d',
            'ЛАБИЛЬНЫЙ': '#adc6ff',
            'ЦИКЛОИД': '#36cfc9'
        };
        return colors[name] || '#d9d9d9';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Загрузка статистики..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert
                    message="Ошибка загрузки данных"
                    description={error}
                    type="error"
                    showIcon
                />
                <Button
                    type="primary"
                    onClick={() => window.location.reload()}
                    style={{ marginTop: 16 }}
                >
                    Обновить страницу
                </Button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="empty-container">
                <Alert
                    message="Нет данных для отображения"
                    description="Данные статистики не загрузились"
                    type="warning"
                    showIcon
                />
            </div>
        );
    }

    return (
        <Layout className="admin-layout">
            <Header className="admin-header">
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <RocketOutlined style={{ color: '#fff', fontSize: '24px' }} />
                        <Title level={3} style={{ color: 'white', margin: 0 }}>
                            Панель администратора
                        </Title>
                    </Space>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        style={{ color: 'white' }}
                        onClick={() => navigate('/logout')}
                    >
                        Выйти
                    </Button>
                </Space>
            </Header>

            <Content style={{ padding: '24px', background: colorBgContainer }}>
                <div
                    className="admin-content"
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        padding: 24,
                        minHeight: 'calc(100vh - 150px)'
                    }}
                >
                    {/* Основные метрики системы */}
                    <Title level={4} style={{ marginBottom: 16 }}>
                        <DashboardOutlined /> Обзор системы
                    </Title>
                    <Row gutter={16} className="summary-stats">
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Всего вопросов"
                                    value={stats.summary.totalQuestions}
                                    prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Всего тестов"
                                    value={stats.summary.totalTests}
                                    prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Всего пользователей"
                                    value={stats.summary.totalUsers}
                                    prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card bordered={false}>
                                <Statistic
                                    title="Активных пользователей"
                                    value={stats.summary.activeUsers}
                                    prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Распределение вопросов */}
                    <Divider orientation="left">
                        <PieChartOutlined /> Распределение вопросов по психотипам
                    </Divider>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Table
                                columns={[
                                    {
                                        title: 'Психотип',
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (text: string) => (
                                            <Tag color={getPsychotypeColor(text)}>
                                                {text}
                                            </Tag>
                                        )
                                    },
                                    {
                                        title: 'Количество',
                                        dataIndex: 'count',
                                        key: 'count',
                                        render: (count: number) => (
                                            <Text strong>{count}</Text>
                                        )
                                    },
                                    {
                                        title: 'Доля',
                                        key: 'percentage',
                                        render: (_, record: PsychotypeStat) => {
                                            const total = stats.questions.totalQuestions || 1;
                                            const percent = Math.round((record.count / total) * 100);
                                            return (
                                                <Tooltip title={`${percent}%`}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Progress
                                                            percent={percent}
                                                            size="small"
                                                            strokeColor={getPsychotypeColor(record.name)}
                                                            showInfo={false}
                                                            style={{ flex: 1 }}
                                                        />
                                                        <Text style={{ width: 40 }}>{percent}%</Text>
                                                    </div>
                                                </Tooltip>
                                            );
                                        }
                                    }
                                ]}
                                dataSource={stats.questions.questionsByPsychotype}
                                rowKey="id"
                                pagination={false}
                                locale={{
                                    emptyText: 'Нет данных о вопросах'
                                }}
                            />
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Статистика по тестам" bordered={false}>
                                <div style={{ marginBottom: 24 }}>
                                    <Text strong>Среднее количество вопросов в тесте:</Text>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginTop: 8
                                    }}>
                                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                                            {Math.round(stats.tests.avgQuestionsPerTest / 10000000000000000000)}
                                        </Text>
                                        <Text type="secondary">вопросов на тест</Text>
                                    </div>
                                </div>

                                <Table
                                    dataSource={stats.tests.testsByType}
                                    columns={[
                                        {
                                            title: 'Тип теста',
                                            dataIndex: 'type',
                                            key: 'type',
                                            render: (type: string) => (
                                                <Tag color={type === 'small' ? 'green' : 'purple'}>
                                                    {type === 'small' ? 'Короткий' : 'Полный'}
                                                </Tag>
                                            )
                                        },
                                        {
                                            title: 'Количество тестов',
                                            dataIndex: 'count',
                                            key: 'count',
                                            render: (count: number) => <Text strong>{count}</Text>
                                        },
                                        {
                                            title: 'Доля',
                                            key: 'share',
                                            render: (_, record) => {
                                                const percent = Math.round(
                                                    (record.count / stats.tests.totalTests) * 100
                                                );
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Progress
                                                            percent={percent}
                                                            size="small"
                                                            showInfo={false}
                                                            strokeColor={record.type === 'small' ? '#52c41a' : '#722ed1'}
                                                            style={{ width: '100%' }}
                                                        />
                                                        <Text>{percent}%</Text>
                                                    </div>
                                                );
                                            }
                                        }
                                    ]}
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Последняя активность */}
                    <Divider orientation="left">
                        <ClockCircleOutlined /> Последняя активность
                    </Divider>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Card title="Последние тесты" bordered={false}>
                                <List
                                    dataSource={stats.activity.recentTests}
                                    renderItem={(item: ActivityItem) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                                title={item.title}
                                                description={formatDate(item.createdAt)}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Новые пользователи" bordered={false}>
                                <List
                                    dataSource={stats.activity.recentUsers}
                                    renderItem={(item: ActivityItem) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar size="small" icon={<UserOutlined />} />}
                                                title={item.username}
                                                description={formatDate(item.createdAt)}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card title="Пройденные тесты" bordered={false}>
                                <List
                                    dataSource={stats.activity.recentResults}
                                    renderItem={(item: ActivityItem) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                                title={item.Test?.title || 'Неизвестный тест'}
                                                description={
                                                    <>
                                                        <Text>Пользователь: {item.User?.username || 'Неизвестный'}</Text>
                                                        <br />
                                                        <Text>{formatDate(item.createdAt)}</Text>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Быстрые действия */}
                    <Divider orientation="left">Быстрые действия</Divider>

                    <Row gutter={16} className="feature-cards">
                        {adminFeatures.map((feature, index) => (
                            <Col key={index} xs={24} sm={12} md={6}>
                                <Card
                                    hoverable
                                    onClick={feature.action}
                                    style={{ borderTop: `4px solid ${feature.color}`, cursor: 'pointer' }}
                                >
                                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                        <div style={{
                                            fontSize: 32,
                                            color: feature.color,
                                            marginBottom: 16
                                        }}>
                                            {feature.icon}
                                        </div>
                                        <Title level={5} style={{ marginBottom: 8 }}>
                                            {feature.title}
                                        </Title>
                                        <Text type="secondary">{feature.description}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default AdminPanel;
