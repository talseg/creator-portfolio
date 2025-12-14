import './App.css'
import { AdminPage } from './pages/AdminPage';
import { ProjectPage } from './pages/ProjectPage';
import { StartPage } from './pages/StartPage';
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { StartPage1 } from './pages/StartPage1';

function NotFound() {
  const loc = useLocation();
  return <div style={{padding:16}}>No match for: <code>{loc.pathname}</code></div>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/user" element={<StartPage1 />} />
        <Route path="/prev" element={<StartPage />} />
        <Route path="/" element={<AdminPage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
