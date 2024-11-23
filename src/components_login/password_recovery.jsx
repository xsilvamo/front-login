import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Obtener el tema actual de las cookies
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        // Escuchar cambios en el tema
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/password-reset', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    // Configuración de colores basada en el tema
    const themeStyles = {
        light: {
            formBg: 'bg-white',
            text: 'text-gray-700',
            title: 'text-[#0092BC]',
            label: 'text-[#0092BC]',
            input: 'bg-white text-gray-700 border-gray-300',
            successMessage: 'text-[#A3D9D3]',
            errorMessage: 'text-red-500'
        },
        dark: {
            formBg: 'bg-gray-800',
            text: 'text-gray-200',
            title: 'text-[#A3D9D3]',
            label: 'text-[#A3D9D3]',
            input: 'bg-gray-700 text-white border-gray-600',
            successMessage: 'text-[#A3D9D3]',
            errorMessage: 'text-red-400'
        }
    };

    const currentTheme = themeStyles[theme];

    return (
        <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
            <form
                onSubmit={handleSubmit}
                className={`${currentTheme.formBg} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}
            >
                <h2 className={`text-4xl font-bold mb-8 ${currentTheme.title} text-center font-ubuntu transition-colors duration-300`}>
                    Recuperar Contraseña
                </h2>

                {message && (
                    <p className={`${currentTheme.successMessage} text-sm mb-4 transition-colors duration-300`}>
                        {message}
                    </p>
                )}
                {error && (
                    <p className={`${currentTheme.errorMessage} text-sm mb-4 transition-colors duration-300`}>
                        {error}
                    </p>
                )}

                <div className="mb-6">
                    <label
                        className={`block ${currentTheme.label} text-sm font-bold mb-2 font-ubuntu transition-colors duration-300`}
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 ${currentTheme.input} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] transition-colors duration-300`}
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Código de Recuperación'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetForm;