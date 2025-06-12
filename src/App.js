import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, addHours, differenceInSeconds } from 'date-fns';

const intervalMap = { Light: 8, Normal: 5, Heavy: 3 };

export default function App() {
  const [lastChange, setLastChange] = useState(null);
  const [history, setHistory] = useState([]);
  const [flow, setFlow] = useState('Normal');
  const [nextChange, setNextChange] = useState(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
    if (storedHistory[0]) {
      const latest = storedHistory[0];
      setLastChange(latest.time);
      setFlow(latest.flow);
      calculateNextChange(latest.time, latest.flow);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextChange) {
        const diffSec = differenceInSeconds(new Date(nextChange), new Date());
        if (diffSec <= 0) {
          setCountdown('该更换了！');
        } else {
          const h = Math.floor(diffSec / 3600);
          const m = Math.floor((diffSec % 3600) / 60);
          setCountdown(`${h}小时${m}分钟后建议更换`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextChange]);

  const handleChange = () => {
    const now = new Date().toISOString();
    const newRecord = { time: now, flow };
    const newHistory = [newRecord, ...history];
    setLastChange(now);
    setHistory(newHistory);
    calculateNextChange(now, flow);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const calculateNextChange = (time, flow) => {
    const interval = intervalMap[flow] || 5;
    const nextTime = addHours(new Date(time), interval);
    setNextChange(nextTime);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>TamCare v0.2</h1>
      
      <div style={styles.card}>
        <p>流量强度：</p>
        <select value={flow} onChange={e => setFlow(e.target.value)} style={styles.select}>
          <option value="Light">少量</option>
          <option value="Normal">中量</option>
          <option value="Heavy">多量</option>
        </select>
        <button onClick={handleChange} style={styles.button}>我已更换</button>
      </div>

      <div style={styles.card}>
        <p>距离上次更换：</p>
        <p style={styles.timer}>
          {lastChange ? formatDistanceToNow(new Date(lastChange)) + ' 前' : '暂无记录'}
        </p>
        <p style={styles.countdown}>{countdown}</p>
      </div>

      <div style={styles.card}>
        <h2>历史记录：</h2>
        <ul style={styles.list}>
          {history.map((item, index) => (
            <li key={index}>
              {new Date(item.time).toLocaleString()} - {item.flow === 'Light' ? '少量' : item.flow === 'Normal' ? '中量' : '多量'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial', textAlign: 'center', padding: 20, backgroundColor: '#fff0f5', minHeight: '100vh' },
  header: { fontSize: 36, color: '#e75480', marginBottom: 20 },
  card: { background: '#ffffffcc', padding: 20, margin: 20, borderRadius: 16, boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  timer: { fontSize: 24, margin: 10 },
  countdown: { fontSize: 20, margin: 10, color: '#d33' },
  button: { fontSize: 20, padding: '10px 20px', borderRadius: 10, backgroundColor: '#e75480', color: 'white', border: 'none' },
  select: { fontSize: 18, padding: 8, borderRadius: 8 },
  list: { listStyle: 'none', padding: 0, fontSize: 18 }
};