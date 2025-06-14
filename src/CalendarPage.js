import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, format, getDay } from 'date-fns';

export default function CalendarPage() {
  const [history, setHistory] = useState([]);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
    buildWeeks();
  }, []);

  const buildWeeks = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });
    let week = [];
    let allWeeks = [];
    days.forEach(day => {
      week.push(day);
      if (getDay(day) === 6) {
        allWeeks.push(week);
        week = [];
      }
    });
    if (week.length) allWeeks.push(week);
    setWeeks(allWeeks);
  };

  const countForDay = (day) => history.filter(r => isSameDay(new Date(r.time||r), day)).length;
  const getDetailsForDay = (day) => {
    const records = history.filter(r => isSameDay(new Date(r.time||r), day));
    const intervals = records.map((rec, idx) => {
      if (idx === records.length-1) return null;
      return Math.floor((new Date(records[idx].time)-new Date(records[idx+1].time))/60000);
    }).filter(i=>i!==null);
    const avg = intervals.length ? Math.floor(intervals.reduce((a,b)=>a+b,0)/intervals.length) : 0;
    return { records, intervals, avg };
  };

  const dayNames = ['日','一','二','三','四','五','六'];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>月度记录</h1>
      <div style={styles.weeknames}>
        {dayNames.map(d => <div key={d} style={styles.weekname}>{d}</div>)}
      </div>
      {weeks.map((week,wi)=>(
        <div key={wi} style={styles.weekRow}>
          {week.map((day,di)=>(
            <div key={di} style={styles.dayBox}>
              <div style={styles.date}>{format(day,'MM/dd')}</div>
              <div>{'🩸'.repeat(Math.min(countForDay(day),5))}</div>
              <div style={styles.detail}>
                {getDetailsForDay(day).records.map((r,i)=>(
                  <div key={i} style={styles.detailItem}>
                    {format(new Date(r.time),'HH:mm')} (+{getDetailsForDay(day).intervals[i]||0}m)
                  </div>
                ))}
                {getDetailsForDay(day).records.length>0 && <div style={styles.avg}>平均 {getDetailsForDay(day).avg} 分钟</div>}
              </div>
            </div>
          ))}
          {week.length<7 && Array.from({length:7-week.length}).map((_,i)=><div key={i} style={styles.emptyBox}></div>)}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container:{padding:20,fontFamily:'Nunito',textAlign:'center'},
  header:{fontSize:32,color:'#F25C78',marginBottom:10},
  weeknames:{display:'flex',justifyContent:'center'},
  weekname:{width:70,fontSize:18,color:'#444'},
  weekRow:{display:'flex',justifyContent:'center',marginBottom:10},
  dayBox:{width:70,minHeight:100,background:'#FFD6D6',margin:2,padding:5,borderRadius:10,position:'relative'},
  date:{fontSize:14,color:'#333'},
  detail:{fontSize:10,textAlign:'left',marginTop:5,overflow:'hidden',height:50},
  detailItem:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
  avg:{fontSize:10,color:'#666',marginTop:2},
  emptyBox:{width:70,margin:2}
};