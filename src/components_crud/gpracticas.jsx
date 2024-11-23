import React, { useState, useEffect } from 'react';
import Cpractica from './cpractica';
import Dpractica from './dpractica';
import Cookies from 'js-cookie';

const Gpracticas = () => {
    const [activeComponent, setActiveComponent] = useState('lista');
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    // Listen for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = Cookies.get('theme') || 'light';
            setTheme(savedTheme);
        };

        // Check for theme changes every second
        const interval = setInterval(handleThemeChange, 1000);

        return () => clearInterval(interval);
    }, []);

    const themeColors = {
        light: {
            background: 'bg-[#DAEDF2]',
            text: 'text-black',
            primaryButton: 'bg-[#0092BC]',
            secondaryButton: 'bg-[#0092BC]',
            buttonHoverPrimary: 'hover:bg-[#A3D9D3]',
            buttonHoverSecondary: 'hover:bg-[#A3D9D3]',
            focusRing: 'focus:ring-[#005F7F]'
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
            primaryButton: 'bg-[#0092BC]',
            secondaryButton: 'bg-[#0092BC]',
            buttonHoverPrimary: 'hover:bg-[#A3D9D3]',
            buttonHoverSecondary: 'hover:bg-[#A3D9D3]',
            focusRing: 'focus:ring-blue-300'
        }
    };

    const currentTheme = themeColors[theme];

    const renderComponent = () => {
        switch (activeComponent) {
            case 'crear':
                return <Cpractica />;
            case 'lista':
            default:
                return <Dpractica />;
        }
    };

    return (
        <div className={`container mx-auto p-4 ${currentTheme.background} ${currentTheme.text} font-ubuntu max-w-lg md:max-w-2xl lg:max-w-3xl transition-colors duration-300`}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
                Gestión de Prácticas
            </h1>
            <div className="mb-4 flex flex-col md:flex-row justify-center">
                <button
                    onClick={() => setActiveComponent('lista')}
                    className={`mr-0 md:mr-2 mb-2 md:mb-0 px-4 py-2 ${currentTheme.primaryButton} text-white rounded transition-colors duration-300 
                        ${currentTheme.buttonHoverPrimary} focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                >
                    Ver Prácticas
                </button>
                <button
                    onClick={() => setActiveComponent('crear')}
                    className={`px-4 py-2 ${currentTheme.secondaryButton} text-white rounded transition-colors duration-300 
                        ${currentTheme.buttonHoverSecondary} focus:outline-none focus:ring-2 ${currentTheme.focusRing}`}
                >
                    Crear Práctica
                </button>
            </div>
            <div className="w-full">{renderComponent()}</div>
        </div>
    );
};

export default Gpracticas;