import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Register = () => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [theme, setTheme] = useState('light');

    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        // Observer para detectar cambios en el tema
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = Cookies.get('theme') || 'light';
                    setTheme(newTheme);
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
            inputText: 'text-gray-700',
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
            card: 'bg-gray-800'
        }
    };

    const currentTheme = themeColors[theme];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Comprobar coincidencia en las contraseñas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', {
                email: formData.email,
                password: formData.password,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
            });
            setSuccess('Usuario registrado correctamente');
        } catch (error) {
            if (error.response) {
                console.error(error.response);
                setError(error.response.data.Message || 'Error al registrar el usuario');
            } else {
                setError('Error de conexión');
            }
        }
    };

    // Para registrarse como empresa, lleva a otra ruta
    const handleRegisterAsCompany = () => {
        navigate('/register_em');
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300`}>
            <div className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}>
                <h2 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Registro
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Nombres */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Nombres
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="nombres"
                            name="nombres"
                            type="text"
                            placeholder=""
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Apellidos */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Apellidos
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="apellidos"
                            name="apellidos"
                            type="text"
                            placeholder=""
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Email
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Contraseña
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="******************"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-6">
                        <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-sm font-bold mb-2`}>
                            Confirmar Contraseña
                        </label>
                        <input
                            className={`shadow appearance-none border ${currentTheme.inputBorder} rounded w-full py-2 px-3 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="******************"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center mt-3 w-full max-w-md">
                        <button
                            className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-2`}
                            type="submit"
                        >
                            Registrarse
                        </button>

                        <button
                            className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-[#A3D9D3]' : 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
                            onClick={handleRegisterAsCompany}
                        >
                            Registrarse como Empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;