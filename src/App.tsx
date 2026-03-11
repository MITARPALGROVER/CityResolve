import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ReportIssue } from './pages/ReportIssue';
import { OpenIssues } from './pages/OpenIssues';
import { MapPage } from './pages/MapPage';
import { Rewards } from './pages/Rewards';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/" element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="report" element={<ReportIssue />} />
                    <Route path="issues" element={<OpenIssues />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="rewards" element={<Rewards />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
