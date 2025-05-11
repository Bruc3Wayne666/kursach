// components/ReportDetailsPage.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ReportDetailPage.css';

// Регистрируем компоненты Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Список всех 13 психотипов
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
}

const ReportDetailsPage: React.FC = () => {
    const location = useLocation();
    const report = location.state?.report as Report | undefined;

    // Функция для извлечения JSON (только для гистограммы)
    const extractJson = (content: string) => {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.error('Ошибка парсинга JSON:', e);
            }
        }
        return null;
    };

    // Функция для подготовки данных гистограммы
    const prepareChartData = (reportContent: string) => {
        const jsonData = extractJson(reportContent);
        if (!jsonData) return null;

        const probabilitiesMap: { [key: string]: number } = {};
        ALL_PSYCHOTYPES.forEach((psychotype) => {
            probabilitiesMap[psychotype] = 0;
        });

        Object.keys(jsonData).forEach((key) => {
            const normalizedKey = key.replace(/\s*ТИП\s*/i, '').trim();
            if (ALL_PSYCHOTYPES.includes(normalizedKey)) {
                probabilitiesMap[normalizedKey] = jsonData[key].probability;
            } else {
                console.warn(`Неизвестный психотип в JSON: ${key}`);
            }
        });

        return {
            labels: ALL_PSYCHOTYPES,
            datasets: [
                {
                    label: 'Вероятность психотипа',
                    data: ALL_PSYCHOTYPES.map((psychotype) => probabilitiesMap[psychotype]),
                    backgroundColor: ALL_PSYCHOTYPES.map((_, index) =>
                        `hsl(${(index * 360) / ALL_PSYCHOTYPES.length}, 70%, 50%)`
                    ),
                    borderColor: ALL_PSYCHOTYPES.map((_, index) =>
                        `hsl(${(index * 360) / ALL_PSYCHOTYPES.length}, 70%, 40%)`
                    ),
                    borderWidth: 1,
                },
            ],
        };
    };

    if (!report) {
        return (
            <div className="error">
                Отчет не найден
                <Link to="/reports" className="back-link">Вернуться к отчетам</Link>
            </div>
        );
    }

    const chartData = prepareChartData(report.reportContent);

    return (
        <div className="report-details-container">
            <Link to="/reports" className="back-link">← Вернуться к отчетам</Link>
            <h1 className="report-title">{report.testTitle}</h1>
            <div className="report-content">
                <h3>Полный отчет:</h3>
                <pre className="full-report">{report.reportContent}</pre>
            </div>
            {chartData && (
                <div className="chart-container">
                    <h2>Вероятности психотипов</h2>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#ffffff', // White text for legend
                                        font: {
                                            size: 14,
                                        },
                                    },
                                },
                                title: {
                                    display: true,
                                    text: `Анализ психотипов для ${report.testTitle}`,
                                    color: '#ffffff', // White text for title
                                    font: {
                                        size: 16,
                                    },
                                },
                                tooltip: {
                                    titleColor: '#ffffff', // White text for tooltip title
                                    bodyColor: '#ffffff', // White text for tooltip body
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'Вероятность',
                                        color: '#ffffff', // White text for y-axis title
                                        font: {
                                            size: 14,
                                        },
                                    },
                                    ticks: {
                                        color: '#ffffff', // White text for y-axis labels
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Психотип',
                                        color: '#ffffff', // White text for x-axis title
                                        font: {
                                            size: 14,
                                        },
                                    },
                                    ticks: {
                                        color: '#ffffff', // White text for x-axis labels
                                        font: {
                                            size: 12,
                                        },
                                        autoSkip: false,
                                        maxRotation: 45,
                                        minRotation: 45,
                                    },
                                },
                            },
                            animation: {
                                duration: 1000,
                                easing: 'easeOutQuart',
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportDetailsPage;
