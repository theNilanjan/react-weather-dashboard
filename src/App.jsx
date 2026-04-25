import { useState, useEffect } from 'react';
import Home from './pages/Home';

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    // Persist theme
    try { localStorage.setItem('theme', theme); } catch(e) {}

    // Add `dark` class to document root for global styles
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div>
      <Home theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
