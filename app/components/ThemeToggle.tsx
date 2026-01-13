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

  // Theme toggle intentionally disabled — site enforces light theme
  return (
    <button aria-label="Theme (light)" className="px-3 py-1 rounded-md bg-gray-100 text-sm text-black cursor-default" disabled>
      🌞
    </button>
  );
};

export default ThemeToggle;
