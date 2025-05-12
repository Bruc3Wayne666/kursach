import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {
    Card,
    Typography,
    Space,
    Button,
    Divider,
    Alert,
    Collapse,
    Tag,
    Spin,
    Empty
} from 'antd';
import {
    ArrowLeftOutlined,
    FileTextOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './ReportDetailPage.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const { Title: AntTitle, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const PSYCHOTYPE_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8AC24A', '#F06292',
    '#7986CB', '#64B5F6', '#BA68C8', '#4DB6AC',
    '#FF8A65'
];

const ALL_PSYCHOTYPES = [
    'ПАРАНОИК',
    'ЭПИЛЕПТОИД',
    'ГИПЕРТИМ',
    'ИСТЕРОИД',
    'ШИЗОИД',
    'ПСИХАСТЕНОИД',
    'СЕНЗИТИВ',
    'ГИПОТИМ',
    'КОНФОРМНЫЙ ТИП',
    'НЕУСТОЙЧИВЫЙ ТИП',
    'АСТЕНИК',
    'ЛАБИЛЬНЫЙ ТИП',
    'ЦИКЛОИД',
];

interface Report {
    id: number;
    testTitle: string;
    reportContent: string;
    testType?: string;
    createdAt?: string;
}

interface PsychotypeData {
    [key: string]: {
        probability: number;
        description?: string;
        traits?: string[];
    };
}

const ReportDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any>(null);
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`http://localhost:3000/report/${id}`);
                const reportData = response.data;

                setReport({
                    id: Number(id),
                    testTitle: reportData.testTitle,
                    reportContent: reportData.reportContent,
                    testType: reportData.testType,
                    createdAt: reportData.createdAt
                });

                const { jsonData, textContent } = extractReportData(reportData.reportContent);
                setTextContent(textContent);

                if (jsonData) {
                    setChartData(prepareChartData(jsonData));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    const extractReportData = (content: string) => {
        try {
            let jsonData: PsychotypeData | null = null;
            let textContent = content;

            if (content.includes('```json')) {
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch && jsonMatch[1]) {
                    jsonData = JSON.parse(jsonMatch[1]);
                    textContent = content.replace(/```json\n[\s\S]*?\n```/, '').trim();
                }
            }

            return { jsonData, textContent };
        } catch (e) {
            console.error('Error parsing report data:', e);
            return { jsonData: null, textContent: content };
        }
    };

    const prepareChartData = (jsonData: PsychotypeData) => {
        const labels: string[] = [];
        const data: number[] = [];
        const backgroundColors: string[] = [];

        ALL_PSYCHOTYPES.forEach((psychotype, index) => {
            const normalizedKey = psychotype.replace(/\s*ТИП\s*/i, '').trim();
            const psychotypeData = jsonData[normalizedKey] || jsonData[psychotype];

            if (psychotypeData && typeof psychotypeData.probability === 'number') {
                labels.push(psychotype);
                data.push(psychotypeData.probability);
                backgroundColors.push(PSYCHOTYPE_COLORS[index % PSYCHOTYPE_COLORS.length]);
            }
        });

        return {
            labels,
            datasets: [{
                label: 'Вероятность психотипа',
                data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Загрузка отчета..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert
                    message="Ошибка загрузки отчета"
                    description={error}
                    type="error"
                    showIcon
                />
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/reports')}
                    style={{ marginTop: 16 }}
                >
                    Вернуться к отчетам
                </Button>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="empty-container">
                <Empty description="Отчет не найден" />
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/reports')}
                    style={{ marginTop: 16 }}
                >
                    Вернуться к отчетам
                </Button>
            </div>
        );
    }

    return (
        <div className="report-details-container">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/reports')}
                >
                    Назад к отчетам
                </Button>

                <Card>
                    <div className="report-header">
                        <AntTitle level={3} style={{ margin: 0 }}>
                            <FileTextOutlined /> {report.testTitle}
                        </AntTitle>
                        <Space>
                            {report.testType && (
                                <Tag color={report.testType === 'small' ? 'blue' : 'purple'}>
                                    {report.testType === 'small' ? 'Быстрый тест' : 'Полный тест'}
                                </Tag>
                            )}
                            {report.createdAt && (
                                <Text type="secondary">
                                    {new Date(report.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Text>
                            )}
                        </Space>
                    </div>

                    <Divider />

                    {chartData ? (
                        <div className="chart-section">
                            <AntTitle level={4} style={{ marginBottom: 24 }}>
                                <BarChartOutlined /> Распределение психотипов
                            </AntTitle>
                            <div style={{ height: 400 }}>
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        return ` ${(context.raw as number * 100).toFixed(1)}%`;
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                max: 1,
                                                ticks: {
                                                    callback: (value) => `${(Number(value) * 100)}%`
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Alert
                            message="Нет данных для графика"
                            type="info"
                            showIcon
                        />
                    )}

                    <Divider />

                    <div className="report-content-section">
                        <AntTitle level={4}>Детальный анализ</AntTitle>
                        <Collapse accordion defaultActiveKey={['1']}>
                            <Panel header="Текстовый отчет" key="1">
                                {textContent ? (
                                    <Paragraph>
                                        {textContent.split('\n').map((paragraph, i) => (
                                            <span key={i}>
                        {paragraph}
                                                <br />
                      </span>
                                        ))}
                                    </Paragraph>
                                ) : (
                                    <Text type="secondary">Текстовый отчет отсутствует</Text>
                                )}
                            </Panel>
                            {chartData && (
                                <Panel header="Структурированные данные" key="2">
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(chartData, null, 2)}
                  </pre>
                                </Panel>
                            )}
                        </Collapse>
                    </div>
                </Card>
            </Space>
        </div>
    );
};

export default ReportDetailsPage;
