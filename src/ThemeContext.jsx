import { createContext, useState, useEffect, useContext } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
    // Check if user has a saved preference in localStorage
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // Default to light mode
        return 'light';
    };

    // Initialize theme state
    const [theme, setTheme] = useState(getSavedTheme);

    // Function to toggle theme
    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        // Set initial value
        if (!localStorage.getItem('theme')) {
            setTheme(mediaQuery.matches ? 'dark' : 'light');
        }

        // Add event listener
        mediaQuery.addEventListener('change', handleChange);

        // Clean up
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using the theme
export const useTheme = () => useContext(ThemeContext);