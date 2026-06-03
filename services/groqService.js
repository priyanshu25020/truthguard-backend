import React, { useState, useEffect } from 'react';
import iconAnalyzed from '../assets/icon-analyzed.png';
import iconReal from '../assets/icon-real.png';
import iconFake from '../assets/icon-fake.png';
import iconAccuracy from '../assets/icon-accuracy.png';

const StatsCards = () => {
  const [realStats, setRealStats] = useState({
    total: 0,
    real: 0,
    fake: 0,
    accuracy: 0 // Default 0 jab tak koi scan na ho
  });

useEffect(() => {
    // 🔥 Function jo data calculate karega
    const fetchRealStats = () => {
      try {
        const storedData = localStorage.getItem('truthGuard_history');
        const history = storedData ? JSON.parse(storedData) : [];

        if (history.length > 0) {
          const total = history.length;
          
          // 🔥 'verdict' aur 'status' dono ko safely read karega
          const realCount = history.filter(item => {
            const resultText = (item.verdict || item.status || "").toUpperCase();
            return resultText.includes('REAL') || 
                   resultText.includes('TRUE') || 
                   (resultText.includes('VERIFIED') && !resultText.includes('UNVERIFIED'));
          }).length;
          
          const fakeCount = history.filter(item => {
            const resultText = (item.verdict || item.status || "").toUpperCase();
            return resultText.includes('FAKE') || 
                   resultText.includes('FALSE') || 
                   resultText.includes('UNVERIFIED');
          }).length;
          
          // Confidence calculation
          const totalConfidence = history.reduce((acc, item) => acc + (Number(item.aiConfidence || item.confidence) || 0), 0);
          const avgAccuracy = Math.round(totalConfidence / total) || 0;

          setRealStats({ total, real: realCount, fake: fakeCount, accuracy: avgAccuracy });
        } else {
          // 🔥 JAB HISTORY KHALI HO (Zero Reset)
          setRealStats({ total: 0, real: 0, fake: 0, accuracy: 0 });
        }
      } catch (error) {
        // Agar JSON parse fail ho jaye toh app crash nahi hoga
        console.error("Error reading history data:", error);
        setRealStats({ total: 0, real: 0, fake: 0, accuracy: 0 });
      }
    };

    // Component load hote hi run karo
    fetchRealStats();

    // 🔥 JAB BHI NAYA SCAN HOGA, YE LISTENER AUTO-UPDATE KAREGA
    window.addEventListener('historyUpdated', fetchRealStats);
    window.addEventListener('storage', fetchRealStats);

    return () => {
      window.removeEventListener('historyUpdated', fetchRealStats);
      window.removeEventListener('storage', fetchRealStats);
    };
  }, []);
  const stats = [
    { 
      label: "News Analyzed", 
      value: realStats.total.toString(),
      increase: "↗ Active",
      img: iconAnalyzed,
      textColor: "text-green-400", 
      boxStyle: "bg-gradient-to-br from-green-500/15 to-[#05040a] border-green-500/40 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]" 
    },
    { 
      label: "Real News", 
      value: realStats.real.toString(),
      increase: "⬆ Verified", 
      img: iconReal,
      textColor: "text-blue-500", 
      boxStyle: "bg-gradient-to-br from-blue-500/15 to-[#05040a] border-blue-500/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" 
    },
    { 
      label: "Likely Fake", 
      value: realStats.fake.toString(),
      increase: "⬆ Detected", 
      img: iconFake,
      textColor: "text-red-500", 
      boxStyle: "bg-gradient-to-br from-red-500/15 to-[#05040a] border-red-500/40 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]" 
    },
    { 
      label: "Accuracy", 
      value: `${realStats.accuracy}%`,
      subtitle: "AI Score", 
      img: iconAccuracy,
      textColor: "text-purple-400", 
      boxStyle: "bg-gradient-to-br from-purple-500/15 to-[#05040a] border-purple-500/40 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]" 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <div key={idx} className={`flex items-center gap-4 p-5 rounded-[20px] border-[1.5px] ${stat.boxStyle} transition-all duration-300 hover:scale-[1.02]`}>
          <div className="flex-shrink-0">
            <img src={stat.img} alt={stat.label} className="w-14 h-14 object-contain mix-blend-screen drop-shadow-lg" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[12px] text-gray-400 mb-1 font-semibold tracking-wide">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-white">{stat.value}</h3>
              {stat.increase && <span className={`text-[11px] font-extrabold ${stat.textColor}`}>{stat.increase}</span>}
            </div>
            {stat.subtitle && <p className="text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{stat.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;