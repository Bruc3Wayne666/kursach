const {Sequelize, DataTypes} = require('sequelize');


// Настройка подключения к базе данных с помощью Sequelize
const sequelize = new Sequelize('tester', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});


// Определение моделей
// Определение моделей
const User = sequelize.define('User ', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true // Включаем timestamps для автоматического добавления createdAt и updatedAt
});

const Test = sequelize.define('Test', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('small', 'large'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'tests',
    timestamps: true
});

const Psychotype = sequelize.define('Psychotype', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'psychotypes',
    timestamps: true
});

const Question = sequelize.define('Question', {
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    correct_answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    PsychotypeId: {  // Добавьте это поле
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Psychotype,
            key: 'id'
        }
    }

}, {
    tableName: 'questions',
    timestamps: true
});

const TestQuestion = sequelize.define('TestQuestion', {
    testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Test,
            key: 'id'
        }
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question,
            key: 'id'
        }
    }
}, {
    tableName: 'test_questions',
    timestamps: true
});


const Result = sequelize.define('Result', {
    user_answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'results',
    timestamps: true
});

const Report = sequelize.define('Report', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    TestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Test,
            key: 'id'
        }
    }
}, {
    tableName: 'reports',
    timestamps: true
});

// Установление связей между моделями
User.hasMany(Report);
Test.hasMany(Report);
Report.belongsTo(User);
Report.belongsTo(Test);



// Установление связей между моделями
User.hasMany(Result);
Test.hasMany(Result);
Question.hasMany(Result);
Psychotype.hasMany(Question);

Result.belongsTo(User);
Result.belongsTo(Test);
Result.belongsTo(Question);
Question.belongsTo(Psychotype);

// В модели TestQuestion
TestQuestion.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasMany(TestQuestion, { foreignKey: 'questionId' });


// В модели Test
Test.belongsToMany(Question, {
    through: TestQuestion,
    foreignKey: 'testId',
    otherKey: 'questionId'
});

// В модели Question
Question.belongsToMany(Test, {
    through: TestQuestion,
    foreignKey: 'questionId',
    otherKey: 'testId'
});


module.exports = {
    User, Test, Psychotype, Question, Result, TestQuestion, Report, sequelize
}
