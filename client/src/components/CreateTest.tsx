import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTest } from '../redux/testSlice';
import { fetchQuestionsAsync } from '../redux/questionSlice';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Spin,
    Alert,
    Table,
    Tag,
    Divider,
    Typography,
    Checkbox,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    FilterOutlined
} from '@ant-design/icons';
import './CreateTest.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateTest = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state: any) => state.questions);
    const [form] = Form.useForm();
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [selectedPsychotype, setSelectedPsychotype] = useState<number | null>(null);
    const [searchText, setSearchText] = useState('');

    const psychotypeNames: { [key: number]: string } = {
        1: 'ПАРАНОИК',
        2: 'ЭПИЛЕПТОИД',
        3: 'ГИПЕРТИМ',
        4: 'ИСТЕРОИД',
        5: 'ШИЗОИД',
        6: 'ПСИХАСТЕНОИД',
        7: 'СЕНЗИТИВ',
        8: 'ГИПОТИМ',
        9: 'КОНФОРМНЫЙ',
        10: 'НЕУСТОЙЧИВЫЙ',
        11: 'АСТЕНИК',
        12: 'ЛАБИЛЬНЫЙ',
        16: 'ЦИКЛОИД'
    };

    useEffect(() => {
        dispatch(fetchQuestionsAsync());
    }, [dispatch]);

    const handleSubmit = (values: any) => {
        const newTest = {
            ...values,
            questionIds: selectedQuestions,
        };
        dispatch(createTest(newTest));
        form.resetFields();
        setSelectedQuestions([]);
        setSelectedPsychotype(null);
    };

    const filteredQuestions = questions
        .filter((q: any) =>
            (selectedPsychotype === null || q.PsychotypeId === selectedPsychotype) &&
            (q.question.toLowerCase().includes(searchText.toLowerCase()) ||
                String(q.id).includes(searchText))
        )
        .sort((a: any, b: any) => a.PsychotypeId - b.PsychotypeId);

    const columns = [
        {
            title: 'Выбрать',
            dataIndex: 'id',
            width: 80,
            render: (id: number) => (
                <Checkbox
                    checked={selectedQuestions.includes(id)}
                    onChange={() => {
                        setSelectedQuestions(prev =>
                            prev.includes(id)
                                ? prev.filter(qId => qId !== id)
                                : [...prev, id]
                        );
                    }}
                />
            ),
        },
        {
            title: 'Вопрос',
            dataIndex: 'question',
            render: (text: string, record: any) => (
                <div>
                    <Text strong>{text}</Text>
                    {record.description && (
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary">{record.description}</Text>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Психотип',
            dataIndex: 'PsychotypeId',
            width: 150,
            render: (id: number) => (
                <Tag color={getPsychotypeColor(id)}>
                    {psychotypeNames[id] || `Тип ${id}`}
                </Tag>
            ),
            filters: Object.entries(psychotypeNames).map(([id, name]) => ({
                text: name,
                value: id,
            })),
            onFilter: (value: any, record: any) => record.PsychotypeId === Number(value),
        },
    ];

    const getPsychotypeColor = (id: number) => {
        const colors = [
            '#ff4d4f', '#13c2c2', '#1890ff', '#722ed1',
            '#fa8c16', '#52c41a', '#eb2f96', '#faad14',
            '#2f54eb', '#a0d911', '#f5222d', '#adc6ff'
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="create-test-container">
            <Card
                title={<Title level={3}>Создание нового теста</Title>}
                className="main-card"
            >
                {loading && (
                    <div className="loading-overlay">
                        <Spin tip="Загрузка вопросов..." size="large" />
                    </div>
                )}

                {error && (
                    <Alert
                        message="Ошибка загрузки"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="Название теста"
                                rules={[{ required: true, message: 'Введите название' }]}
                            >
                                <Input placeholder="Название теста" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Тип теста"
                                rules={[{ required: true, message: 'Выберите тип' }]}
                            >
                                <Select placeholder="Тип теста">
                                    <Option value="small">Короткий (10-15 вопросов)</Option>
                                    <Option value="large">Полный (30+ вопросов)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Описание теста"
                        rules={[{ required: true, message: 'Введите описание' }]}
                    >
                        <TextArea rows={3} placeholder="Описание теста" />
                    </Form.Item>

                    <Divider orientation="left">
                        <FilterOutlined /> Выбор вопросов ({selectedQuestions.length} выбрано)
                    </Divider>

                    <div className="questions-controls">
                        <Input.Search
                            placeholder="Поиск по вопросам"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300, marginBottom: 16 }}
                        />

                        <Select
                            placeholder="Фильтр по психотипу"
                            allowClear
                            onChange={(value) => setSelectedPsychotype(value)}
                            style={{ width: 200, marginLeft: 16 }}
                        >
                            {Object.entries(psychotypeNames).map(([id, name]) => (
                                <Option key={id} value={Number(id)}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredQuestions}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        rowClassName={(record) =>
                            selectedQuestions.includes(record.id) ? 'selected-row' : ''
                        }
                        scroll={{ y: 400 }}
                    />

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            size="large"
                            disabled={selectedQuestions.length === 0}
                        >
                            Создать тест
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateTest;
