import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, format, differenceInMinutes, isToday } from 'date-fns';

export default function Home() {
  const [history, setHistory] = useState([]);
  const [lastChange, setLastChange] = useState(null);
  const [interval, setIntervalTime] = useState(3);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('history')) || [];
    const storedInterval = parseFloat(localStorage.getItem('interval')) || 3;
    setIntervalTime(storedInterval);
    if (stored.length > 0 && typeof stored[0] === 'string') {
      stored = stored.map(ts => ({ time: ts }));
    }
    setHistory(stored);
    if (stored[0]) setLastChange(stored[0].time);
  }, []);

  const saveHistory = newHist => {
    setHistory(newHist);
    localStorage.setItem('history', JSON.stringify(newHist));
    if (newHist[0]) setLastChange(newHist[0].time);
    else setLastChange(null);
  };

  const handleChange = () => {
    const now = new Date().toISOString();
    saveHistory([{ time: now }, ...history]);
  };

  const handleDelete = idx => {
    const newHist = history.filter((_, i) => i !== idx);
    saveHistory(newHist);
  };

  const handleIntervalChange = e => {
    const v = parseFloat(e.target.value);
    setIntervalTime(v);
    localStorage.setItem('interval', v);
  };

  const today = history.filter(item => isToday(new Date(item.time)));
  const intervals = today.map((rec, i) => {
    if (i === today.length - 1) return null;
    return differenceInMinutes(new Date(rec.time), new Date(today[i + 1].time));
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>TamCare</h1>
      <button onClick={handleChange} style={styles.bigButton}>+ 记录更换</button>
      <p style={styles.timer}>
        {lastChange
          ? `上次更换: ${format(new Date(lastChange), 'HH:mm')}（${formatDistanceToNow(new Date(lastChange))}前）`
          : '暂无记录'}
      </p>
      <div style={styles.setting}>
        <p onClick={() => setShowSlider(!showSlider)} style={{ cursor: 'pointer' }}>
          建议更换间隔：<b>{interval} 小时</b>
        </p>
        {showSlider && (
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={interval}
            onChange={handleIntervalChange}
          />
        )}
      </div>
      <div style={styles.todayBox}>
        <h3>今天记录</h3>
        {today.length === 0 ? <p>暂无</p> :
          today.map((item, idx) => (
            <div key={idx} style={styles.recordLine}>
              <span style={styles.dot}></span> {format(new Date(item.time), 'HH:mm')}
              {idx !== 0 && (
                <span style={styles.intervalText}>（+{intervals[idx - 1]} 分钟）</span>
              )}
              <button
                onClick={() => handleDelete(idx)}
                style={styles.deleteBtn}
                title="删除这一条记录"
              >
                🗑️
              </button>
            </div>
          ))
        }
      </div>
    </div>
);

}

const styles = {
  container: { textAlign: 'center', padding: 20, backgroundColor: '#faf3f3', minHeight: '100vh' },
  header: { fontSize: 40, color: '#F25C78', marginBottom: 20, fontWeight: 700 },
  bigButton: {
    fontSize: 24,
    padding: '15px 40px',
    borderRadius: 50,
    background: 'linear-gradient(45deg,#F25C78,#FFB6C1)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    marginBottom: 20
  },
  timer: { fontSize: 24, margin: 20, color: '#333' },
  setting: { fontSize: 20, background: '#FFD6D6', padding: 20, borderRadius: 20, margin: '10px 30px' },
  todayBox: { fontSize: 20, marginTop: 30, background: '#ffffffaa', padding: 20, borderRadius: 20 },
  recordLine: {
    margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  dot: { width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F25C78', marginRight: 8 },
  intervalText: { fontSize: 14, color: '#666', marginLeft: 8 },
  deleteBtn: {
    marginLeft: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18
  }
};