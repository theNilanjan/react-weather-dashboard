import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors duration-200"
    >
      {theme === 'dark' ? (
        <span className="flex items-center gap-2 text-white">
          <FaMoon /> Dark
        </span>
      ) : (
        <span className="flex items-center gap-2 text-gray-900">
          <FaSun /> Light
        </span>
      )}
    </button>
  );
}
