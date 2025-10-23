// =============================================================================
// src/App.tsx - CORREGIDO
// =============================================================================

import { Routes, Route } from 'react-router-dom'; // Se quita BrowserRouter de aquí
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    // El Router ya no es necesario aquí
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;