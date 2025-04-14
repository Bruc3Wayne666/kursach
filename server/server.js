const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const {sequelize, Test, Psychotype, Result, User, Question, TestQuestion} = require('./models');

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
    // const {test_id, question_id, user_id, testAnswers} = req.body;

    const userAnswers = req.body

    try {
        await Result.bulkCreate(userAnswers.map(({user_answer, test_id, question_id, user_id}) =>
            ({
                TestId: test_id,
                QuestionId: question_id,
                UserId: user_id,
                user_answer
            })
        ))


        res.status(201).json({});
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при сохранении результата');
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
