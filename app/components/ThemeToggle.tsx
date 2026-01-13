"use client";

import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light'|'dark'>('light');

  useEffect(() => {
    // initialize from localStorage or default to light
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const t = stored === 'dark' ? 'dark' : 'light';
    setTheme(t);
    if (typeof document !== 'undefined') {
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch(e){}
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 text-sm">
      {theme === 'light' ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
