import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Cookies from 'js-cookie';
import bodyImage from '../imagen/body.jpg';

const Layout = () => {
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

    // Colores constantes para header y footer
    const fixedColors = {
        header: 'bg-[#0092BC]',
        register: 'bg-[#A3D9D3] text-[#0092BC] hover:bg-[#8ec3c0]',
        login: 'bg-[#0092BC] hover:bg-[#007a9a]'
    };

    // Colores para el contenido principal que sí cambian con el tema
    const themeColors = {
        light: {
            background: 'bg-[#DAEDF2]',
            text: 'text-black',
            accent: 'text-[#0092BC]',
            card: 'bg-white',
            secondaryText: 'text-[#005F7F]'
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
            accent: 'text-[#A3D9D3]',
            card: 'bg-gray-800',
            secondaryText: 'text-gray-300'
        }
    };

    const currentTheme = themeColors[theme];

    return (
        <div className={`flex flex-col min-h-screen font-ubuntu ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
            {/* Header - Colores fijos */}
            <header className={`${fixedColors.header} text-white p-4 md:p-6`}>
                <div className="flex justify-between items-center mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold italic">ULINK</h1>
                    <div className="flex items-center space-x-2 md:space-x-4">
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
                                className={`absolute w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 ${theme === 'dark'
                                    ? 'bg-blue-400 translate-x-10'
                                    : 'bg-white translate-x-0'
                                    }`}
                            />
                            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-500'} mr-1`} />
                        </div>

                        {/* Botones con colores fijos */}
                        <a
                            href="/register"
                            className={`${fixedColors.register} px-3 py-2 rounded font-bold italic text-sm md:text-lg transition duration-300`}
                        >
                            Registrarse
                        </a>
                        <a
                            href="/"
                            className={`${fixedColors.login} text-white px-3 py-2 rounded font-bold italic text-sm md:text-lg transition duration-300`}
                        >
                            Iniciar sesión
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col md:flex-row container mx-auto my-8 items-start justify-between px-4 w-full">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <Outlet />
                </div>
                <div className="w-full md:w-1/2 md:ml-8">
                    <div className="text-right mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0092BC] mb-4">
                            Bienvenido a ULINK
                        </h2>
                        <p className={currentTheme.secondaryText}>
                            Conectamos estudiantes con oportunidades increíbles.
                        </p>
                    </div>
                    <div className={`${currentTheme.card} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
                        <img
                            src={bodyImage}
                            alt="Personas trabajando"
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                </div>
            </main>

            {/* Footer - Colores fijos */}
            <footer className={`${fixedColors.header} text-white text-center p-4 md:p-2`}>
                <p className="text-sm md:text-base">Desarrollado por estudiantes UTEM</p>
                <p className="text-sm md:text-base">tallersistemasdesoftware@utem.cl / Teléfono (---) --- --- ---</p>
                <p className="text-sm md:text-base">&copy; 2024 ULINK. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;