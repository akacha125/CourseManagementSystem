import React, { useState, useEffect } from 'react';

function DarkMode() {

    const [isDarkMode, setIsDarkMode] = useState(true); // Başlangıçta dark mod

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-bs-theme');
        }
    }, [isDarkMode]);

    return(
        <div/>
    )

};

export default DarkMode;