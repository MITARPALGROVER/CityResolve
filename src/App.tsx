import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { PremiumLanding } from './pages/PremiumLanding';
import { Dashboard } from './pages/Dashboard';
import { ReportIssue } from './pages/ReportIssue';
import { OpenIssues } from './pages/OpenIssues';
import { MapPage } from './pages/MapPage';
import { Rewards } from './pages/Rewards';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';
import { Logout } from './pages/Logout';
import { IssueDetail } from './pages/IssueDetail';
import { RequireAuth } from './auth/RequireAuth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PremiumLanding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="report" element={<ReportIssue />} />
                    <Route path="issues" element={<OpenIssues />} />
                    <Route path="issues/:id" element={<IssueDetail />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="rewards" element={<Rewards />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="logout" element={<Logout />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
