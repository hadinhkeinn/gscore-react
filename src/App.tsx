import { Routes, Route } from "react-router-dom"
import MainLayout from "@/layout/MainLayout.tsx"
import Dashboard from "@/pages/Dashboard.tsx"
import SearchScores from "@/pages/SearchScores.tsx"
import Reports from "@/pages/Reports.tsx"
import Analytics from "@/pages/Analytics.tsx"

function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search-scores" element={<SearchScores />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </MainLayout>
    );
}

export default App;