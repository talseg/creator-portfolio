import './App.css'
import { AdminPage } from './pages/AdminPage';
import { StartPage } from './pages/StartPage';
import { HashRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
