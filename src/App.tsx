import './App.css'
import { AdminPage } from './components/adminPage/AdminPage';
import { StartPage } from './components/startPage/StartPage';
import { HashRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/user" element={<StartPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
