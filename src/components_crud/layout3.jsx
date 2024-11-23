import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Cookies from 'js-cookie';

const Layout3 = ({ children, isLogout }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        Cookies.set('theme', newTheme, { expires: 365 });
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const themeColors = {
        light: {
            background: 'bg-[#DAEDF2]',
            text: 'text-black',
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
        }
    };

    const currentTheme = themeColors[theme];

    return (
        <div className={`flex flex-col min-h-screen ${currentTheme.background} ${currentTheme.text} font-ubuntu transition-colors duration-300`}>
            {/* Header */}
            <header className="bg-[#0092BC] text-white p-6">
                <div className="flex justify-between items-center mx-auto">
                    <Link to="/gpracticas" className="text-5xl font-bold italic">ULINK</Link>
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <div
                            onClick={toggleTheme}
                            className={`relative w-20 h-10 rounded-full p-1 cursor-pointer flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
                            role="button"
                            aria-label="Toggle dark mode"
                            tabIndex={0}
                        >
                            <Sun className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-yellow-500'} ml-1`} />
                            <div
                                className={`absolute w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 ${theme === 'dark' ? 'bg-blue-400 translate-x-10' : 'bg-white translate-x-0'}`}
                            />
                            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-500'} mr-1`} />
                        </div>

                        {/* Logout Button */}
                        {!isLogout && (
                            <Link
                                to="/logout-em"
                                className="bg-red-600 text-white px-3 py-2 rounded font-bold text-lg hover:bg-red-700 transition duration-300"
                            >
                                Salir
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Body */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#0092BC] text-white text-center p-2">
                <p>Desarrollado por estudiantes UTEM</p>
                <p>tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p>&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout3;