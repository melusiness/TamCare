import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import CalendarPage from './CalendarPage';

export default function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <Link to="/" style={styles.link}>记录</Link>
        <Link to="/calendar" style={styles.link}>日历</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'center', background: '#F25C78', padding: 12, borderRadius: 16, margin: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  link: { color: 'white', margin: '0 30px', textDecoration: 'none', fontSize: 22, fontWeight: 600 }
};