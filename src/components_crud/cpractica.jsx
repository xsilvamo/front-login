import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Cpractica = () => {
    const [theme, setTheme] = useState('light');
    const [formData, setFormData] = useState({
        Titulo: '',
        Descripcion: '',
        Id_Empresa: '',
        Ubicacion: '',
        Fecha_inicio: '',
        Fecha_fin: '',
        Requisitos: '',
        Fecha_expiracion: '',
        Modalidad: '',
        Area_practica: '',
        Jornada: ''
    });
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState(null);

    const cookieOptions = {
        expires: 7, // Cookie expires in 7 days
        secure: true, // Only transmitted over HTTPS
        sameSite: 'strict', // Protect against CSRF
        path: '/' // Available across the entire site
    };

    // Function to set authentication token in cookies
    const setAuthToken = (token) => {
        Cookies.set('authToken', token, cookieOptions);
    };

    // Function to get authentication token from cookies
    const getAuthToken = () => {
        return Cookies.get('authToken');
    };

    // Function to remove authentication token from cookies
    const removeAuthToken = () => {
        Cookies.remove('authToken', { path: '/' });
    };

    useEffect(() => {
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);
    }, []);


    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = Cookies.get('theme') || 'light';
            setTheme(savedTheme);
        };

        const interval = setInterval(handleThemeChange, 1000);
        return () => clearInterval(interval);
    }, []);

    const themeColors = {
        light: {
            background: 'bg-white',
            text: 'text-gray-800',
            label: 'text-gray-700',
            input: 'bg-white border-gray-300',
            inputFocus: 'focus:border-[#0092BC] focus:ring-[#0092BC]',
            button: 'bg-[#0092BC] hover:bg-[#A3D9D3]',
            error: 'text-red-500'
        },
        dark: {
            background: 'bg-gray-800',
            text: 'text-gray-100',
            label: 'text-gray-200',
            input: 'bg-gray-700 border-gray-600 text-white',
            inputFocus: 'focus:border-[#0092BC] focus:ring-[#0092BC]',
            button: 'bg-[#0092BC] hover:bg-[#A3D9D3]',
            error: 'text-red-400'
        }
    };

    const currentTheme = themeColors[theme];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        const { Fecha_inicio, Fecha_fin, Fecha_expiracion } = formData;

        if (!formData.Titulo) tempErrors.Titulo = "El título es requerido";
        if (!formData.Descripcion) tempErrors.Descripcion = "La descripción es requerida";
        if (!formData.Id_Empresa) tempErrors.Id_Empresa = "El ID de la empresa es requerido";
        if (!formData.Ubicacion) tempErrors.Ubicacion = "La ubicación es requerida";
        if (!Fecha_inicio) tempErrors.Fecha_inicio = "La fecha de inicio es requerida";
        if (!Fecha_fin) tempErrors.Fecha_fin = "La fecha de fin es requerida";
        if (!formData.Requisitos) tempErrors.Requisitos = "Los requisitos son requeridos";
        if (!Fecha_expiracion) tempErrors.Fecha_expiracion = "La fecha de expiración es requerida";
        if (!formData.Area_practica) tempErrors.Area_practica = "El área de práctica es requerida";

        const today = new Date();
        if (Fecha_inicio && new Date(Fecha_inicio) < today) {
            tempErrors.Fecha_inicio = "La fecha de inicio no puede ser anterior a hoy.";
        }
        if (Fecha_fin && new Date(Fecha_fin) < new Date(Fecha_inicio)) {
            tempErrors.Fecha_fin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
        }
        if (Fecha_expiracion && new Date(Fecha_expiracion) < new Date(Fecha_fin)) {
            tempErrors.Fecha_expiracion = "La fecha de expiración no puede ser anterior a la fecha de fin.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                // Get token from cookies instead of localStorage
                const token = getAuthToken();
                if (!token) {
                    setSubmitMessage({ type: 'error', text: 'No se encontró el token de autenticación.' });
                    return;
                }

                const formattedData = {
                    ...formData,
                    Id_Empresa: parseInt(formData.Id_Empresa, 10),
                    Fecha_inicio: new Date(formData.Fecha_inicio).toISOString(),
                    Fecha_fin: new Date(formData.Fecha_fin).toISOString(),
                    Fecha_expiracion: new Date(formData.Fecha_expiracion).toISOString(),
                };

                // Create axios instance with default headers
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:8080',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // Important for sending cookies with cross-origin requests
                });

                const response = await axiosInstance.post('/Create-practicas', formattedData);

                setSubmitMessage({ type: 'success', text: `Práctica creada exitosamente con ID: ${response.data.id_practica}` });

                setFormData({
                    Titulo: '',
                    Descripcion: '',
                    Id_Empresa: '',
                    Ubicacion: '',
                    Fecha_inicio: '',
                    Fecha_fin: '',
                    Requisitos: '',
                    Fecha_expiracion: '',
                    Modalidad: '',
                    Area_practica: '',
                    Jornada: ''
                });
            } catch (error) {
                // Handle token expiration
                if (error.response?.status === 401) {
                    removeAuthToken();
                    setSubmitMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicie sesión nuevamente.' });
                } else {
                    setSubmitMessage({ type: 'error', text: 'Error al crear la práctica: ' + (error.response?.data?.error || error.message) });
                }
            }
        }
    };


    return (
        <div className={`max-w-md mx-auto mt-10 p-6 ${currentTheme.background} rounded-lg shadow-xl font-ubuntu transition-colors duration-300`}>
            <h2 className={`text-2xl font-bold mb-6 text-center ${currentTheme.text}`}>Crear Nueva Práctica</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="Titulo" className={`block text-sm font-medium ${currentTheme.label}`}>Título:</label>
                    <input
                        type="text"
                        id="Titulo"
                        name="Titulo"
                        value={formData.Titulo}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Titulo && <span className={`text-xs ${currentTheme.error}`}>{errors.Titulo}</span>}
                </div>

                <div>
                    <label htmlFor="Descripcion" className={`block text-sm font-medium ${currentTheme.label}`}>Descripción:</label>
                    <textarea
                        id="Descripcion"
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Descripcion && <span className={`text-xs ${currentTheme.error}`}>{errors.Descripcion}</span>}
                </div>

                <div>
                    <label htmlFor="Id_Empresa" className={`block text-sm font-medium ${currentTheme.label}`}>ID de la Empresa:</label>
                    <input
                        type="number"
                        id="Id_Empresa"
                        name="Id_Empresa"
                        value={formData.Id_Empresa}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Id_Empresa && <span className={`text-xs ${currentTheme.error}`}>{errors.Id_Empresa}</span>}
                </div>

                <div>
                    <label htmlFor="Ubicacion" className={`block text-sm font-medium ${currentTheme.label}`}>Ubicación:</label>
                    <input
                        type="text"
                        id="Ubicacion"
                        name="Ubicacion"
                        value={formData.Ubicacion}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                        maxLength={30}
                    />
                    {errors.Ubicacion && <span className={`text-xs ${currentTheme.error}`}>{errors.Ubicacion}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_inicio" className={`block text-sm font-medium ${currentTheme.label}`}>Fecha de inicio:</label>
                    <input
                        type="date"
                        id="Fecha_inicio"
                        name="Fecha_inicio"
                        value={formData.Fecha_inicio}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Fecha_inicio && <span className={`text-xs ${currentTheme.error}`}>{errors.Fecha_inicio}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_fin" className={`block text-sm font-medium ${currentTheme.label}`}>Fecha de fin:</label>
                    <input
                        type="date"
                        id="Fecha_fin"
                        name="Fecha_fin"
                        value={formData.Fecha_fin}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Fecha_fin && <span className={`text-xs ${currentTheme.error}`}>{errors.Fecha_fin}</span>}
                </div>

                <div>
                    <label htmlFor="Requisitos" className={`block text-sm font-medium ${currentTheme.label}`}>Requisitos:</label>
                    <textarea
                        id="Requisitos"
                        name="Requisitos"
                        value={formData.Requisitos}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Requisitos && <span className={`text-xs ${currentTheme.error}`}>{errors.Requisitos}</span>}
                </div>

                <div>
                    <label htmlFor="Fecha_expiracion" className={`block text-sm font-medium ${currentTheme.label}`}>Fecha de expiración:</label>
                    <input
                        type="date"
                        id="Fecha_expiracion"
                        name="Fecha_expiracion"
                        value={formData.Fecha_expiracion}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Fecha_expiracion && <span className={`text-xs ${currentTheme.error}`}>{errors.Fecha_expiracion}</span>}
                </div>

                <div>
                    <label htmlFor="Modalidad" className={`block text-sm font-medium ${currentTheme.label}`}>Modalidad:</label>
                    <input
                        type="text"
                        id="Modalidad"
                        name="Modalidad"
                        value={formData.Modalidad}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                </div>

                <div>
                    <label htmlFor="Area_practica" className={`block text-sm font-medium ${currentTheme.label}`}>Área de práctica:</label>
                    <input
                        type="text"
                        id="Area_practica"
                        name="Area_practica"
                        value={formData.Area_practica}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                    {errors.Area_practica && <span className={`text-xs ${currentTheme.error}`}>{errors.Area_practica}</span>}
                </div>

                <div>
                    <label htmlFor="Jornada" className={`block text-sm font-medium ${currentTheme.label}`}>Jornada:</label>
                    <input
                        type="text"
                        id="Jornada"
                        name="Jornada"
                        value={formData.Jornada}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm ${currentTheme.input} ${currentTheme.inputFocus} focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 rounded-md font-semibold text-white transition-colors duration-300 ${currentTheme.button}`}
                >
                    Crear Práctica
                </button>

                {submitMessage && (
                    <div className={`mt-4 text-center ${submitMessage.type === 'success' ? 'text-green-500' : currentTheme.error}`}>
                        {submitMessage.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Cpractica;