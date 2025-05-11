import React from 'react';
import { Card, Col, Row, Typography, Divider, Space } from 'antd';
import { YoutubeOutlined, BookOutlined } from '@ant-design/icons';
import './PsychotypeGuides.css';

const { Title, Text, Paragraph } = Typography;

const psychotypes = [
    {
        id: 1,
        name: 'ПАРАНОИК',
        description: 'Целеустремленные, упорные, часто одержимые идеей люди. Могут быть подозрительными и ригидными.',
        resources: [
            {
                type: 'video',
                title: 'Паранойяльный психотип: особенности и рекомендации',
                url: 'https://www.youtube.com/watch?v=example1',
                source: 'YouTube'
            },
            {
                type: 'article',
                title: 'Как общаться с паранойяльным типом личности',
                url: 'https://example.com/paranoid',
                source: 'Психологический журнал'
            }
        ]
    },
    {
        id: 2,
        name: 'ЭПИЛЕПТОИД',
        description: 'Педантичные, аккуратные, любят порядок. Могут быть вспыльчивыми и злопамятными.',
        resources: [
            {
                type: 'video',
                title: 'Эпилептоидный тип: как найти общий язык',
                url: 'https://www.youtube.com/watch?v=example2',
                source: 'YouTube'
            }
        ]
    },
    {
        id: 3,
        name: 'ГИПЕРТИМ',
        description: 'Энергичные, общительные, оптимистичные. Могут быть поверхностными и непостоянными.',
        resources: [
            {
                type: 'article',
                title: 'Гипертимный характер: плюсы и минусы',
                url: 'https://example.com/hyperthymic',
                source: 'Психология сегодня'
            }
        ]
    },
    // Добавьте остальные психотипы по аналогии
    {
        id: 5,
        name: 'ШИЗОИД',
        description: 'Замкнутые, погруженные в себя, с богатым внутренним миром. Могут испытывать трудности в общении.',
        resources: [
            {
                type: 'video',
                title: 'Шизоидный тип личности: особенности мышления',
                url: 'https://www.youtube.com/watch?v=example5',
                source: 'YouTube'
            }
        ]
    },
    {
        id: 16,
        name: 'ЦИКЛОИД',
        description: 'Эмоционально неустойчивые, с перепадами настроения. Периоды активности сменяются апатией.',
        resources: [
            {
                type: 'article',
                title: 'Циклоидный темперамент: как жить в ритме',
                url: 'https://example.com/cycloid',
                source: 'Журнал практической психологии'
            }
        ]
    }
];

const PsychotypeGuides: React.FC = () => {
    return (
        <div className="psychotype-guides-container">
            <Title level={2}>Гайды по психотипам</Title>
            <Paragraph>
                На этой странице собраны полезные материалы о различных психотипах личности.
                Вы найдете статьи, видео и рекомендации по взаимодействию с каждым типом.
            </Paragraph>

            <Divider />

            <Row gutter={[16, 16]}>
                {psychotypes.map(psychotype => (
                    <Col xs={24} sm={12} lg={8} key={psychotype.id}>
                        <Card
                            title={psychotype.name}
                            bordered={false}
                            className="psychotype-card"
                        >
                            <Text>{psychotype.description}</Text>

                            <Divider orientation="left">Ресурсы</Divider>

                            <Space direction="vertical" size="middle">
                                {psychotype.resources.map((resource, index) => (
                                    <div key={index}>
                                        {resource.type === 'video' ? (
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                <YoutubeOutlined /> {resource.title} ({resource.source})
                                            </a>
                                        ) : (
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                <BookOutlined /> {resource.title} ({resource.source})
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PsychotypeGuides;
