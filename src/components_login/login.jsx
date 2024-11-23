import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    const cookieOptions = {
        expires: 7, // Cookie expires in 7 days
        secure: window.location.protocol === 'https:', // Only send cookie over HTTPS
        sameSite: 'Lax', // Provides some CSRF protection while allowing normal navigation
        path: '/' // Cookie available across the entire site
    };

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

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

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            const token = Cookies.get('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loginResponse = await axios.post('http://localhost:8080/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Respuesta del inicio de sesión:', loginResponse.data);

            const { token, uid } = loginResponse.data;

            if (!token || !uid) {
                throw new Error('No se recibieron las credenciales necesarias');
            }

            // Guardar credenciales en cookies
            Cookies.set('authToken', token, cookieOptions);
            Cookies.set('uid', uid, cookieOptions);

            console.log('Token and UID stored in cookies');

            // Redirección basada en el componente
            if (loginResponse.config.url.includes('LoginEm')) {
                navigate('/gpracticas');
            } else {
                // Verificar estado del perfil para usuario normal
                try {
                    const profileResponse = await axios.get('http://localhost:8080/profile-status', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    console.log('Estado del perfil:', profileResponse.data);

                    if (profileResponse.data && profileResponse.data.PerfilCompletado === false) {
                        console.log('Perfil incompleto, redirigiendo a complete_profile');
                        navigate('/complete_profile');
                    } else {
                        console.log('Perfil completo, redirigiendo a search');
                        navigate('/search');
                    }
                } catch (profileError) {
                    console.error('Error al verificar el estado del perfil:', profileError);
                    navigate('/search');
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                setError(error.response.data.error || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Error de conexión');
            }
            Cookies.remove('authToken', { path: '/' });
            Cookies.remove('uid', { path: '/' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#DAEDF2]'} transition-colors duration-300 font-ubuntu`}>
            <form onSubmit={handleSubmit} className={`${currentTheme.background} shadow-lg rounded-lg px-16 pt-12 pb-12 mb-8 w-full max-w-md transition-colors duration-300`}>
                <h2 className={`text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-center`}>
                    Iniciar Sesión
                </h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-12">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-xl font-bold mb-2`}>
                        Email
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded-lg w-full py-4 px-5 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                        id="email"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-12">
                    <label className={`block ${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} text-xl font-bold mb-2`}>
                        Contraseña
                    </label>
                    <input
                        className={`shadow appearance-none border ${currentTheme.inputBorder} rounded-lg w-full py-4 px-5 ${currentTheme.inputText} leading-tight focus:outline-none focus:shadow-outline focus:border-[#0092BC] ${currentTheme.inputBg}`}
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <hr className={`border-t-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} my-8`} />

                <div className="flex justify-center mb-8">
                    <span
                        className={`${theme === 'dark' ? 'text-[#A3D9D3]' : 'text-[#0092BC]'} font-bold hover:underline cursor-pointer`}
                        onClick={() => navigate('/password_recovery')}
                    >
                        ¿Olvidaste tu contraseña?
                    </span>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button
                        type="submit"
                        className={`${theme === 'dark' ? 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-gray-800' : 'bg-[#0092BC] hover:bg-[#007a9a] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                    <button
                        type="button"
                        className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-[#A3D9D3]' : 'bg-[#A3D9D3] hover:bg-[#8ec3c0] text-white'} font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
                        onClick={() => navigate('/login_em')}
                    >
                        Iniciar como Empresa
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;