import { Routes, Route } from 'react-router-dom';
import Dashboard from '~/pages/Dashboard';

function HomeRouter() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default HomeRouter;
