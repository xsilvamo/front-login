import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagen2 from '../imagen/imagen2.png';
import Cookies from 'js-cookie';

const Logout = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const handleThemeChange = () => {
            const newTheme = Cookies.get('theme') || 'light';
            setTheme(newTheme);
        };

        // Observar cambios en el atributo data-theme del documento
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    handleThemeChange();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const themeColors = {
        light: {
            background: 'bg-white',
            text: 'text-black',
            accent: 'text-[#0092BC]',
            inputBg: 'bg-white',
            inputText: 'text-black',
            inputBorder: 'border-gray-300',
            card: 'bg-white'
        },
        dark: {
            background: 'bg-gray-800',
            text: 'text-white',
            accent: 'text-[#A3D9D3]',
            inputBg: 'bg-gray-700',
            inputText: 'text-white',
            inputBorder: 'border-gray-600',
            card: 'bg-gray-800',
            formWrapper: 'bg-gray-900'
        }
    };

    const currentTheme = themeColors[theme];

    useEffect(() => {
        console.log('Tokens antes de eliminar:', {
            authToken: Cookies.get('authToken'),
            uid: Cookies.get('uid')
        });

        // Remove cookies with the same options used in login
        const cookieOptions = {
            path: '/',
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax'
        };

        Cookies.remove('authToken', cookieOptions);
        Cookies.remove('uid', cookieOptions);

        console.log('Tokens después de eliminar:', {
            authToken: Cookies.get('authToken'),
            uid: Cookies.get('uid')
        });

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen 
            ${theme === 'dark'
                ? 'bg-gray-900'
                : 'bg-[#DAEDF2]'} 
            transition-colors duration-300`}>
            <img
                src={imagen2}
                alt="Descripción de la imagen"
                className={`mb-6 w-1/3 h-auto rounded-md shadow-md 
                    ${theme === 'dark'
                        ? 'opacity-90'
                        : 'opacity-100'}`}
            />
            <h2
                className={`text-3xl font-bold mb-4 
                    ${theme === 'dark'
                        ? 'text-white'
                        : 'text-[#1D4157]'}`}
                style={{ fontFamily: 'Rubik' }}
            >
                Has cerrado sesión
            </h2>
            <p
                className={`mb-4 
                    ${theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-[#1D4157]'}`}
                style={{ fontFamily: 'Ubuntu' }}
            >
                Gracias por usar ULINK. Esperamos verte pronto.
            </p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-2 text-white rounded-md shadow-sm bg-[#0092BC] hover:bg-[#A3D9D3] transition-colors"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default Logout;