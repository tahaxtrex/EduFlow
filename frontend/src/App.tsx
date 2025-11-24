// @ts-nocheck
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Questionnaire from './pages/Questionnaire';
import CourseViewer from './pages/CourseViewer';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/course/:id" element={<CourseViewer />} />
            </Routes>
        </Router>
    );
}

export default App;
