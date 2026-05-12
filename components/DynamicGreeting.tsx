'use client';

import { useState, useEffect } from 'react';

import { MdWbSunny, MdNightsStay, MdWbTwilight } from 'react-icons/md';

export default function DynamicGreeting({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      // Get current time in UTC
      const nowUtc = new Date();

      // Convert to Asia/Dhaka (UTC+6)
      const dhakaTime = new Date(nowUtc.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
      const hours = dhakaTime.getHours();
      const minutes = dhakaTime.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // Time ranges in minutes from midnight
      if (totalMinutes >= 300 && totalMinutes < 720) {
        setGreeting('Good Morning');
      } else if (totalMinutes >= 720 && totalMinutes < 1020) {
        setGreeting('Good Afternoon');
      } else if (totalMinutes >= 1020 && totalMinutes < 1260) {
        setGreeting('Good Evening');
      } else {
        setGreeting('Good Night');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const getEmoji = () => {
    if (greeting === 'Good Morning' || greeting === 'Good Afternoon') return '☀️';
    if (greeting === 'Good Evening') return '👋';
    return '🌙';
  };

  if (!greeting) return <div className="invisible h-20"></div>;

  return (
    <div className="">
      <div className="flex">
        <p className="text-sm font-semibold text-slate-500 mb-1">
          {greeting} {getEmoji()}
        </p>
      </div>

      <div className='flex  items-center gap-3'>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          Welcome back,
        </h1>
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 leading-tight">
          <span className="capitalize">{userName}</span>
        </h1>
      </div>
    </div>
  );
}
