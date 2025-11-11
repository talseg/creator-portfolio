import './App.css'
import { AdminPage } from './components/adminPage/AdminPage';
import { StartPage } from './components/startPage/StartPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
