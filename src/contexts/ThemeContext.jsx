import React, { createContext, useContext, useState, useEffect } from 'react';


const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);

    return context;
}

export const ThemeProvider = ({ children }) => {

    const [darkMode, setDarkMode] = useState(()=>{
            const saved = localStorage.getItem('theme')
            return saved === 'dark'
        })

    useEffect(()=>{
            localStorage.setItem('theme', darkMode ? 'dark' : 'light' )
        }, [darkMode])


    const toggleTheme = () =>{
            setDarkMode((prev) => !prev)
        }

    const value = {
        darkMode,
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            { children }
        </ThemeContext.Provider>
    )


}