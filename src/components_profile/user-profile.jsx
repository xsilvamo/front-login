import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserProfile = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');

    ///LISTA DE CARRERAS UWU//

    const carrerasList = [
        { id: 1, nombre: "Ingeniería en Informatica" },
        { id: 2, nombre: "Ingeniería Civil Biomedica" },
        { id: 3, nombre: "Bachillerato en Ciencias de la Ingenieria" },
        { id: 4, nombre: "Ingenieria Civil en Computacion, mencion Informatica" },
        { id: 5, nombre: "Ingenieria Civil Industrial" },
        { id: 6, nombre: "Ingenieria Civil en Ciencias de Datos" },
        { id: 7, nombre: "Ingenieria Civil en Electronica" },
        { id: 8, nombre: "Ingenieria Civil en Mecanica" },
        { id: 9, nombre: "Ingenieria en Geomensura" },
        { id: 10, nombre: "Ingenieria Industrial" },
        { id: 11, nombre: "Dibujante Proyectista" },
        { id: 12, nombre: "Diseño en Comunicacion Visual" },
        { id: 13, nombre: "Diseño Industrial" },
        { id: 14, nombre: "Trabajo Social" },
        { id: 15, nombre: "Ingenieria Civil Quimica" },
        { id: 16, nombre: "Ingeniería Civil Matematica" },
        { id: 17, nombre: "Quimica y Farmacia" },
        { id: 18, nombre: "Ingenieria en Biotecnologia" },
        { id: 19, nombre: "Ingenieria en Alimentos" },
        { id: 20, nombre: "Quimica Industrial" },
        { id: 21, nombre: "Arquitectura" },
        { id: 22, nombre: "Ingenieria Civil en Obras Civiles" },
        { id: 23, nombre: "Ingenieria en Construccion" },
        { id: 24, nombre: "Ingenieria Civil en Prevencion de Riesgos y Medioambiente" },
        { id: 25, nombre: "Administracion Publica" },
        { id: 26, nombre: "Bibliotecologia y Documentacion" },
        { id: 27, nombre: "Contador Publico y Auditor" },
        { id: 28, nombre: "Ingenieria Comercial" },
        { id: 29, nombre: "Ingenieria en Comercio Internacional" },
        { id: 30, nombre: "Ingenieria en Gestion Turistica" },
        { id: 31, nombre: "Derecho" },
        { id: 32, nombre: "Psicologia" }
    ];

    const [profileData, setProfileData] = useState({
        fotoPerfil: null,
        nombres: '',
        apellidos: '',
        email: '',
        fecha_nacimiento: '',
        ano_ingreso: '',
        id_carrera: null,
    });

    const cookieOptions = {
        expires: 7, // Cookie expires in 7 days
        secure: window.location.protocol === 'https:', // Only send cookie over HTTPS
        sameSite: 'Lax', // Provides some CSRF protection while allowing normal navigation
        path: '/' // Cookie available across the entire site
    };

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

    useEffect(() => {
        axios.interceptors.request.use((config) => {
            const token = Cookies.get('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    // Si el token ha expirado o es inválido, limpiar cookies y redirigir al login
                    Cookies.remove('authToken', { path: '/' });
                    Cookies.remove('uid', { path: '/' });
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [navigate]);

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
        const fetchProfileData = async () => {
            const uid = Cookies.get('uid'); // Obtener UID desde las cookies
            if (!uid) {
                console.error('UID no encontrado');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/usuarios/${uid}`);
                console.log('Profile Response:', response.data);
                setProfileData({
                    fotoPerfil: response.data.Foto_Perfil || null,
                    nombres: response.data.Nombres || '',
                    apellidos: response.data.Apellidos || '',
                    email: response.data.Correo || '',
                    fecha_nacimiento: response.data.Fecha_Nacimiento || '',
                    ano_ingreso: response.data.Ano_Ingreso || '',
                    id_carrera: parseInt(response.data.Id_carrera) || null,
                });
            } catch (error) {
                console.error('Error al obtener datos del perfil:', error);
                if (error.response && error.response.status === 401) {
                    // Si hay error de autenticación, limpiar cookies y redirigir
                    Cookies.remove('authToken', { path: '/' });
                    Cookies.remove('uid', { path: '/' });
                    navigate('/login');
                }
            }
        };

        fetchProfileData();
    }, [navigate]);

    const getNombreCarrera = (id) => {
        const carrera = carrerasList.find(c => c.id === id);
        return carrera ? carrera.nombre : 'Carrera no especificada';
    };

    // Formatear fecha para mostrarla de manera más amigable
    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificada';
        const fechaObj = new Date(fecha);
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const año = fechaObj.getFullYear();
        return `${dia}/${mes}/${año}`;
    };


    return (
        <main className="flex-grow">
            <div className="max-w-3xl mx-auto p-4">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 md:p-6 transition-colors duration-300`}>
                    <div className="flex flex-col items-center mb-8">
                        {profileData.fotoPerfil ? (
                            <img
                                src={profileData.fotoPerfil}
                                alt="avatar"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-300 object-cover mb-4"
                            />
                        ) : (
                            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
                                <span className="text-gray-400 text-4xl">📷</span>
                            </div>
                        )}
                        <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-center`}>
                            {profileData.nombres} {profileData.apellidos}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3
                                className="text-lg font-semibold text-[#0092BC] mb-4"
                                style={{ fontFamily: 'Rubik' }}
                            >
                                Información Personal
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Fecha de Nacimiento
                                    </label>
                                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>
                                        {formatearFecha(profileData.fecha_nacimiento)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Correo
                                    </label>
                                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-black'} break-words`}>
                                        {profileData.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3
                                className="text-lg font-semibold text-[#0092BC] mb-4"
                                style={{ fontFamily: 'Rubik' }}
                            >
                                Información Académica
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Carrera
                                    </label>
                                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>
                                        {getNombreCarrera(profileData.id_carrera)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Año de Ingreso
                                    </label>
                                    <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>
                                        {profileData.ano_ingreso || 'No especificado'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
    bg-[#0092BC] hover:bg-[#A3D9D3] 
    transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserProfile;