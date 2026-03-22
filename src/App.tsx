import './App.css'
import { lazy, Suspense } from 'react'
import { ProjectPage } from './pages/ProjectPage';
import { PrevStartPage } from './pages/PrevStartPage';
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { MainPage } from './pages/MainPage';
import { MobileProjectPage } from './pages/MobileProjectPage';
import styled from 'styled-components';

const AdminPage = lazy(() =>
  import('./pages/AdminPage').then(module => ({ default: module.AdminPage }))
);

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  font-size: 2rem;
  white-space: pre;
  color: red;
`;

function NotFound() {
  const loc = useLocation();
  return <ErrorWrapper>{"Wrong address: "}<code>{loc.pathname}</code></ErrorWrapper>;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/prev" element={<PrevStartPage />} />
        <Route path="/admin"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminPage />
            </Suspense>
          } />
        <Route path="/" element={<MainPage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/mobile-project/:projectId" element={<MobileProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
