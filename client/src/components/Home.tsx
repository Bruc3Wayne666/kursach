// Home.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { Card, Space, Typography, Avatar, Button } from 'antd';
import {
    LogoutOutlined,
    FormOutlined,
    DashboardOutlined,
    FileTextOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import './Home.css';

const { Title, Text } = Typography;

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNavigateTo = (path: string) => {
        navigate('/' + path);
    };

    const features = [
        {
            title: 'Пройти тесты',
            icon: <FormOutlined style={{ fontSize: '24px' }} />,
            description: 'Определите свой психотип и получите детальный анализ',
            action: () => handleNavigateTo('tests'),
            color: '#1890ff'
        },
        {
            title: 'Админ-панель',
            icon: <DashboardOutlined style={{ fontSize: '24px' }} />,
            description: 'Управление системой для администраторов',
            action: () => handleNavigateTo('admin_panel'),
            color: '#722ed1'
        },
        {
            title: 'Мои результаты',
            icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
            description: 'Просмотр истории пройденных тестов',
            action: () => handleNavigateTo('reports'),
            color: '#13c2c2'
        },
        {
            title: 'Справочник',
            icon: <TeamOutlined style={{ fontSize: '24px' }} />,
            description: 'Подробные гайды по всем психотипам',
            action: () => handleNavigateTo('psychotype-guides'),
            color: '#52c41a'
        }
    ];

    return (
        <div className="home-container">
            <div className="user-profile">
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <Title level={3} style={{ marginTop: 16 }}>Добро пожаловать, {user?.username}!</Title>
                <Text type="secondary">Ваш личный кабинет психологической диагностики</Text>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        hoverable
                        className="feature-card"
                        onClick={feature.action}
                        style={{ borderLeft: `4px solid ${feature.color}` }}
                    >
                        <Space direction="vertical" align="center">
                            <div className="feature-icon" style={{ color: feature.color }}>
                                {feature.icon}
                            </div>
                            <Title level={4} style={{ margin: 0 }}>{feature.title}</Title>
                            <Text type="secondary">{feature.description}</Text>
                        </Space>
                    </Card>
                ))}
            </div>

            <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={() => dispatch(logout())}
                className="logout-button"
            >
                Выйти из системы
            </Button>
        </div>
    );
};

export default Home;
