const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const GigaChat = require('gigachat-node').GigaChat;
const {sequelize, Test, Psychotype, Result, User, Question, TestQuestion, Report} = require('./models');

const app = express();
const port = 3000;

app.use(cors());


// Middleware для парсинга JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
// app.use(bodyParser.json());

const client = new GigaChat({
    clientSecretKey: 'OWY5ZTEzZjgtZGVhOC00NjgyLWI1MGYtZWU5OGE2YjcyZjNmOjgzYjIwOGU2LTIzYTItNDBiZS04NzE3LTJiODk1OTA3YjZiYQ==',
    isIgnoreTSL: true,
    isPersonal: true,
    autoRefreshToken: true
});
client.createToken();

// Авторизация пользователя
app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({where: {username}});

        if (user && await bcrypt.compare(password, user.password)) {
            // Успешная авторизация, возвращаем данные пользователя
            res.json({id: user.id, username: user.username, role: user.role});
        } else {
            res.status(401).send('Неверное имя пользователя или пароль');
        }
    } catch (error) {
        res.status(500).send('Ошибка при авторизации');
    }
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const existingUser = await User.findOne({where: {username}});
        if (existingUser) {
            return res.status(409).send('Пользователь с таким именем уже существует');
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({username, password: hashedPassword, role: 'user'});
        res.status(201).json({id: newUser.id, username: newUser.username, role: newUser.role});
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при регистрации пользователя');
    }
});

// Маршрут для получения всех вопросов
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении вопросов');
    }
});


// Маршрут для создания нового вопроса
app.post('/questions', async (req, res) => {
    const {topic, questionText, correctAnswer} = req.body;
    console.log(req.body)
    try {
        // Найдем psychotypeId по topic
        const psychotype = await Psychotype.findOne({where: {name: topic}});

        if (!psychotype) {
            return res.status(404).send('Психотип не найден'); // Обработка случая, когда психотип не найден
        }

        const psychotypeId = psychotype.id; // Получаем psychotypeId

        const newQuestion = await Question.create({
            question: questionText,
            correct_answer: correctAnswer,
            PsychotypeId: psychotypeId
        });
        res.status(201).json(newQuestion); // Возвращаем созданный вопрос
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при создании вопроса');
    }
});

// Маршрут для получения всех тестов
app.get('/tests', async (req, res) => {
    try {
        const tests = await Test.findAll();
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении тестов');
    }
});

// Маршрут для получения теста по ID
app.get('/tests/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const test = await Test.findByPk(id);

        if (!test) {
            return res.status(404).send('Тест не найден');
        }

        res.json(test);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении теста');
    }
});

app.get('/tests/:id/questions', async (req, res) => {
    const {id} = req.params;
    try {
        // Find the test by ID
        const test = await Test.findByPk(id);
        if (!test) {
            return res.status(404).send('Тест не найден');
        }

        // Find associated TestQuestion entries for the specified test ID
        const testQuestions = await TestQuestion.findAll({
            where: {
                testId: id
            }
        });

        // Extract question IDs from the TestQuestion entries
        const questionIds = testQuestions.map(testQuestion => testQuestion.questionId);

        // Find the questions using the extracted IDs
        const questions = await Question.findAll({
            where: {
                id: questionIds
            }
        });

        // Format the questions for the response
        const formattedQuestions = questions.map(question => ({
            id: question.id,
            question: question.question, // Adjust this based on your Question model
            // Add any other fields from the Question model that you want to return
        }));

        res.json(formattedQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении вопросов теста');
    }
});


// Маршрут для создания нового теста
app.post('/tests', async (req, res) => {
    const {title, type, description, questionIds} = req.body;

    try {
        // Создаем новый тест
        const newTest = await Test.create({title, type, description});

        // Устанавливаем отношения между тестом и вопросами
        if (questionIds && questionIds.length > 0) {
            // Создаем связи между тестом и вопросами
            const testQuestions = questionIds.map(questionId => ({
                testId: newTest.id, // ID созданного теста
                questionId: questionId // ID вопроса
            }));

            // Предполагая, что у вас есть модель TestQuestions
            await TestQuestion.bulkCreate(testQuestions);
        }

        res.status(201).json(newTest); // Возвращаем созданный тест
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при создании теста');
    }
});


// Сохранение результатов теста
app.post('/results', async (req, res) => {
    const userAnswers = req.body;

    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        return res.status(400).send('Нет данных для сохранения');
    }

    const { test_id, user_id } = userAnswers[0];

    try {
        // Сохраняем ответы пользователя
        await Result.bulkCreate(userAnswers.map(({ user_answer, test_id, question_id, user_id }) => ({
            TestId: test_id,
            QuestionId: question_id,
            UserId: user_id,
            user_answer
        })));

        // Получаем вопросы теста с их PsychotypeId
        const testQuestions = await TestQuestion.findAll({
            where: { testId: test_id },
            include: [{
                model: Question,
                attributes: ['id', 'PsychotypeId']
            }]
        });

        // Собираем уникальные PsychotypeId
        const psychotypeIds = [...new Set(testQuestions.map(tq => tq.Question.PsychotypeId).filter(id => id))];

        // Загружаем психотипы из БД по id
        const psychotypes = await Psychotype.findAll({
            where: { id: psychotypeIds }
        });

        // Создаем мапу psychotypeId -> psychotypeName
        const psychotypeMap = {};
        psychotypes.forEach(pt => {
            psychotypeMap[pt.id] = pt.name;
        });

        // Мапа questionId -> psychotypeId
        const questionToPsychotypeId = {};
        testQuestions.forEach(tq => {
            if (tq.Question && tq.Question.PsychotypeId) {
                questionToPsychotypeId[tq.Question.id] = tq.Question.PsychotypeId;
            }
        });

        // Получаем все ответы пользователя
        const userResults = await Result.findAll({
            where: { TestId: test_id, UserId: user_id }
        });

        // Подсчитываем ответы по психотипам
        const psychotypeCounts = {};

        userResults.forEach(result => {
            const psychotypeId = questionToPsychotypeId[result.QuestionId];
            if (!psychotypeId) return;

            const psychotypeName = psychotypeMap[psychotypeId];
            if (!psychotypeName) return;

            if (!psychotypeCounts[psychotypeName]) {
                psychotypeCounts[psychotypeName] = { yes: 0, no: 0 };
            }

            if (result.user_answer === true) {
                psychotypeCounts[psychotypeName].yes++;
            } else {
                psychotypeCounts[psychotypeName].no++;
            }
        });

        const payload = {
            message: 'Результаты сохранены и агрегированы',
            psychotypeAnswerSummary: psychotypeCounts
        }

        console.log(payload)

        const response = await client.completion({
            "model":"GigaChat:latest",
            "messages": [
                {
                    role:"user",
                    content: `Посмотри овтеты на тест и сделай развёрнутый отчёт с рекомендациями по психотипу, а так же скажи какой больше психотип у человека. ${JSON.stringify(payload)}`
                }
            ]
        });

        // Сохранение отчета в базе данных
        const reportContent = response.choices[0].message;
        await Report.create({
            content: reportContent.content,
            UserId: user_id,
            TestId: test_id
        });

        console.log(reportContent)

        res.status(201).json({
            responseText: reportContent
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при сохранении результатов');
    }
});

// Получение всех отчетов для конкретного пользователя
app.get('/reports/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Получаем все отчеты для пользователя
        const reports = await Report.findAll({
            where: { UserId: userId },
            include: [{
                model: Test,
                attributes: ['title'] // Получаем название теста
            }]
        });

        if (!reports || reports.length === 0) {
            return res.status(404).send('Нет отчетов для данного пользователя');
        }

        // Формируем ответ с массивом отчетов и названиями тестов
        const response = reports.map(report => ({
            reportContent: report.content,
            testTitle: report.Test.title // Название теста
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении отчетов');
    }
});


// Получение отчета по его ID
app.get('/report/:id', async (req, res) => {
    const reportId = req.params.id;

    try {
        // Получаем отчет из базы данных
        const report = await Report.findByPk(reportId, {
            include: [{
                model: Test,
                attributes: ['title'] // Получаем название теста
            }]
        });

        if (!report) {
            return res.status(404).send('Отчет не найден');
        }

        // Формируем ответ с отчетом и названием теста
        res.status(200).json({
            reportContent: report.content,
            testTitle: report.Test.title // Название теста
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении отчета');
    }
});


// Запуск сервера и синхронизация моделей
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');
        await sequelize.sync(); // Синхронизация моделей с базой данных

        app.listen(port, () => {
            console.log(`Сервер запущен на http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
    }
};

startServer();
