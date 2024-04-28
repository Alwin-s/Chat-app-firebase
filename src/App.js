import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />; 
    } else {
      return children;
    }
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route  path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
