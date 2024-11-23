import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import Cookies from 'js-cookie';

const Layout2 = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMenuOpen(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
            menuButton: 'bg-[#DAEDF2]',
            menuButtonIcon: '#0092BC',
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
            menuButton: 'bg-gray-700',
            menuButtonIcon: '#ffffff',
        }
    };

    const currentTheme = themeColors[theme];

    return (
        <div className={`flex flex-col min-h-screen ${currentTheme.background} ${currentTheme.text} font-ubuntu transition-colors duration-300`}>
            {/* Header */}
            <header className="bg-[#0092BC] text-white p-6 relative z-20">
                <div className="flex justify-between items-center mx-auto">
                    <Link to="/search" className="text-5xl font-bold italic">ULINK</Link>
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

                        {/* Menu Toggle Button */}
                        <button
                            onClick={toggleMenu}
                            className={`p-2 ${currentTheme.menuButton} rounded-full`}
                        >
                            {isMenuOpen ?
                                <X color={currentTheme.menuButtonIcon} size={32} /> :
                                <Menu color={currentTheme.menuButtonIcon} size={32} />
                            }
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar Menu */}
            {isMenuOpen && (
                <div className="fixed top-0 right-0 h-full w-64 bg-[#0092BC] text-white shadow-lg z-30 flex flex-col p-6 transition-transform duration-300">
                    <Link
                        to="/user-profile"
                        className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC]"
                    >
                        Perfil
                    </Link>
                    <Link
                        to="/search"
                        className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC]"
                    >
                        Buscar
                    </Link>
                    <Link
                        to="/leerforo"
                        className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC]"
                    >
                        Foro
                    </Link>
                    <Link
                        to="/logout"
                        className="block py-4 px-2 rounded-md transition-colors duration-200 hover:bg-[#DAEDF2] hover:text-[#0092BC] active:bg-[#DAEDF2] active:text-[#0092BC]"
                    >
                        Salir
                    </Link>

                    <ChevronRight
                        onClick={toggleMenu}
                        className="mt-auto self-end cursor-pointer hover:text-[#DAEDF2] transition duration-300"
                        size={24}
                        color="white"
                    />
                </div>
            )}

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

export default Layout2;