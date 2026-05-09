'use client';

import { useState, useEffect } from 'react';

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
      // Morning: 5:00 AM – 11:59 AM (300 - 719)
      // Afternoon: 12:00 PM – 4:59 PM (720 - 1019)
      // Evening: 5:00 PM – 8:59 PM (1020 - 1259)
      // Night: 9:00 PM – 4:59 AM (1260 - 299)

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
    
    // Optional: Update every minute to stay accurate
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Return null or a skeleton if greeting is not set yet to avoid hydration mismatch
  if (!greeting) return <h1 className="font-h1 text-h1 text-primary invisible">Greeting, {userName}</h1>;

  return (
    <h1 className="font-h1 text-h1 text-primary">
      {greeting}, {userName}
    </h1>
  );
}
