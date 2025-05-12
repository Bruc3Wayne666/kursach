import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestionAsync } from '../redux/questionSlice';
import {
    Form,
    Input,
    Select,
    Button,
    Card,
    Typography,
    message,
    Divider
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './AddQuestion.css';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PSYCHOTYPE_OPTIONS = [
    'ПАРАНОИК',
    'ЭПИЛЕПТОИД',
    'ГИПЕРТИМ',
    'ИСТЕРОИД',
    'ШИЗОИД',
    'ПСИХАСТЕНОИД',
    'СЕНЗИТИВ',
    'ГИПОТИМ',
    'КОНФОРМНЫЙ',
    'НЕУСТОЙЧИВЫЙ',
    'АСТЕНИК',
    'ЛАБИЛЬНЫЙ',
    'ЦИКЛОИД'
];

const AddQuestion: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            await dispatch(addQuestionAsync({
                topic: values.topic,
                questionText: values.questionText,
                correctAnswer: values.correctAnswer === 'ДА'
            }));

            form.resetFields();
            message.success('Вопрос успешно добавлен!');
        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Не удалось добавить вопрос');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-question-container">
            <Card className="add-question-card">
                <Title level={3} className="page-title">
                    <PlusOutlined /> Добавить новый вопрос
                </Title>

                <Divider />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="question-form"
                >
                    <Form.Item
                        name="topic"
                        label="Тематика вопроса"
                        rules={[{ required: true, message: 'Выберите тематику' }]}
                    >
                        <Select
                            placeholder="Выберите психотип"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {PSYCHOTYPE_OPTIONS.map(psychotype => (
                                <Option key={psychotype} value={psychotype}>
                                    {psychotype}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="questionText"
                        label="Текст вопроса"
                        rules={[
                            { required: true, message: 'Введите текст вопроса' },
                            { min: 10, message: 'Минимум 10 символов' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Введите полный текст вопроса"
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="correctAnswer"
                        label="Правильный ответ"
                        rules={[{ required: true, message: 'Выберите правильный ответ' }]}
                    >
                        <Select placeholder="Выберите вариант ответа">
                            <Option value="ДА">ДА</Option>
                            <Option value="НЕТ">НЕТ</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<PlusOutlined />}
                            size="large"
                        >
                            Добавить вопрос
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddQuestion;
