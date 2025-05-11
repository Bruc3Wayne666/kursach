import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../components/Auth';
import Home from '../components/Home';
import Tests from '../components/Tests';
import Test from '../components/Test';
import { RootState } from '../redux/store';
import AddQuestion from "../components/AddQuestion";
import AdminPanel from "../components/AdminPanel.tsx";
import CreateTest from "../components/CreateTest.tsx";
import ReportsPage from "../components/ReportsPage.tsx";
import ReportDetailsPage from "../components/ReportDetailPage.tsx";
import PsychotypeGuides from "../components/PsychotypeGuides.tsx"; // Новый компонент

const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Router>
            <div>
                {user ? (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tests" element={<Tests />} />
                        <Route path="/test/:id" element={<Test />} />
                        <Route path="/admin_panel" element={<AdminPanel />} />
                        <Route path="/add_question" element={<AddQuestion />} />
                        <Route path="/create_test" element={<CreateTest />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/report/:id" element={<ReportDetailsPage />} />
                        <Route path="/psychotype-guides" element={<PsychotypeGuides />} /> {/* Новый маршрут */}
                    </Routes>
                ) : (
                    <Auth />
                )}
            </div>
        </Router>
    );
};

export default App;
