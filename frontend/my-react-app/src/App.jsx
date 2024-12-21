import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TopNav from './components/TopNav';

function App() {
  const handleColorChange = (color) => {
    // Implement theme color change logic here
    console.log('Theme color changed:', color);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <TopNav onColorChange={handleColorChange} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 