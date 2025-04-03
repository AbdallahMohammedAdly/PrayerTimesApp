import React, { useEffect, useState } from 'react';
import { Moon, Sun, Bell, BellOff, Fuel as Mosque } from 'lucide-react';
import { format } from 'date-fns';
import type { PrayerTimes, TimingsResponse } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          'https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2'
        );
        const data: TimingsResponse = await response.json();
        setPrayerTimes(data.data.timings);
        setCurrentDate(data.data.date.readable);
        setHijriDate(`${data.data.date.hijri.date} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to fetch prayer times: ${err.message}`);
        } else {
          setError('Failed to fetch prayer times. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const toggleNotifications = () => {
    if (Notification.permission === 'granted') {
      setNotifications(!notifications);
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotifications(true);
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Mosque className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Times</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              aria-label={notifications ? 'Disable notifications' : 'Enable notifications'}
            >
              {notifications ? (
                <Bell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <BellOff className="h-6 w-6 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">{currentDate}</p>
            <p className="text-md text-emerald-600 dark:text-emerald-400">{hijriDate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayerTimes && Object.entries(prayerTimes).map(([prayer, time]) => (
              <div
                key={prayer}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {prayer}
                </h3>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {format(new Date(`2024-01-01 ${time}`), 'hh:mm a')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-gray-600 dark:text-gray-400">
          <p>Prayer times provided by Aladhan API</p>
          <p className='mt-2 dark:text-emerald-400 p-5'>CopyRight © by Abdullahmohammedadly</p>
        </footer>
      </div>
    </div>
  );
}

export default App;