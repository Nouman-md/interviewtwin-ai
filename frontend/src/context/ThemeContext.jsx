import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    return 'dark';
  }

  if (savedTheme === 'light') {
    return 'light';
  }

  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    // Always remove the old theme first.
    root.classList.remove('dark');
    root.classList.remove('light');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem('theme', theme);

    // Keep browser color-scheme synchronized.
    root.style.colorScheme =
      theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark'
    );
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }

  return context;
};