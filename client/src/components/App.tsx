// App.tsx
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../components/Auth';
import Home from '../components/Home';
import Tests from '../components/Tests'; // Импортируем компонент тестов
import Test from '../components/Test'; // Импортируем компонент тестов
import { RootState } from '../redux/store';
import AddQuestion from "../components/AddQuestion";
import AdminPanel from "../components/AdminPanel.tsx";
import CreateTest from "../components/CreateTest.tsx";

const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Router>
            <div>
                {user ? (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tests" element={<Tests />} /> {/* Путь для раздела тестов */}
                        <Route path="/test/:id" element={<Test />} /> {/* Путь для раздела тестов */}
                        <Route path="/admin_panel" element={<AdminPanel />} /> {/* Путь для раздела тестов */}
                        <Route path="/add_question" element={<AddQuestion />} /> {/* Путь для раздела тестов */}
                        <Route path="/create_test" element={<CreateTest />} /> {/* Путь для раздела тестов */}
                    </Routes>
                ) : (
                    <Auth />
                )}
            </div>
        </Router>
    );
};

export default App;
