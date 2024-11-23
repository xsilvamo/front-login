import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react';
import Cookies from 'js-cookie';

const Dpractica = () => {
    const [practicas, setPracticas] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPractica, setSelectedPractica] = useState(null);
    const [theme, setTheme] = useState('light');
    const [formData, setFormData] = useState({
        Titulo: '',
        Descripcion: '',
        Ubicacion: '',
        Fecha_inicio: '',
        Fecha_fin: '',
        Requisitos: '',
        Fecha_expiracion: '',
        Modalidad: '',
        Area_practica: '',
        Jornada: ''
    });

    const cookieOptions = {
        expires: 7,
        secure: true,
        sameSite: 'strict',
        path: '/'
    };

    // Token management functions
    const getAuthToken = () => {
        return Cookies.get('authToken');
    };

    const removeAuthToken = () => {
        Cookies.remove('authToken', { path: '/' });
    };

    // Create axios instance with default configuration
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        withCredentials: true
    });

    // Add request interceptor to include token
    axiosInstance.interceptors.request.use((config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Add response interceptor to handle token expiration
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                removeAuthToken();
                setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        fetchPracticas();
        const savedTheme = Cookies.get('theme') || 'light';
        setTheme(savedTheme);

        const handleThemeChange = () => {
            const savedTheme = Cookies.get('theme') || 'light';
            setTheme(savedTheme);
        };

        const interval = setInterval(handleThemeChange, 1000);
        return () => clearInterval(interval);
    }, []);

    const themeColors = {
        light: {
            background: 'bg-[#DAEDF2]',
            text: 'text-black',
            tableHeader: 'bg-[#0092BC] text-white',
            tableRow: 'hover:bg-gray-100',
            tableBorder: 'border-gray',
            formBackground: 'bg-white',
            inputBorder: 'border-gray-300',
            primaryButton: 'bg-[#0092BC] hover:bg-[#A3D9D3]',
            secondaryButton: 'bg-[#A3D9D3] hover:bg-[#0092BC]',
            successAlert: 'bg-green-100 border-green-400 text-green-700',
            errorAlert: 'bg-red-100 border-red-400 text-red-700'
        },
        dark: {
            background: 'bg-gray-900',
            text: 'text-white',
            tableHeader: 'bg-gray-800 text-white',
            tableRow: 'hover:bg-gray-700',
            tableBorder: 'border-gray-600',
            formBackground: 'bg-gray-800',
            inputBorder: 'border-gray-600',
            primaryButton: 'bg-blue-600 hover:bg-blue-700',
            secondaryButton: 'bg-gray-600 hover:bg-gray-700',
            successAlert: 'bg-green-900 border-green-600 text-green-200',
            errorAlert: 'bg-red-900 border-red-600 text-red-200'
        }
    };

    const actionButtons = {
        edit: 'bg-[#7b4b94] hover:bg-[#9b6ab4]', // Color púrpura con hover más claro
        delete: 'bg-[#ffd166] hover:bg-[#ffdc85]' // Color amarillo con hover más claro
    };

    const currentTheme = themeColors[theme];

    // Obtener las prácticas de la empresa
    const fetchPracticas = async () => {
        try {
            const response = await axiosInstance.get('/Get-practicas-empresa');
            setPracticas(response.data);
        } catch (err) {
            setError('Error al cargar las prácticas: ' + (err.response?.data?.error || err.message));
        }
    };

    // Updated delete function using axiosInstance
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/Delete-practica/${id}`);
            setSuccessMessage('La práctica fue eliminada exitosamente');
            fetchPracticas();
        } catch (err) {
            setError('Error al eliminar la práctica: ' + (err.response?.data?.error || err.message));
        }
    };

    // Handle edit remains the same
    const handleEdit = (practica) => {
        setSelectedPractica(practica);
        setFormData({
            Titulo: practica.Titulo,
            Descripcion: practica.Descripcion,
            Ubicacion: practica.Ubicacion,
            Fecha_inicio: practica.Fecha_inicio.split('T')[0],
            Fecha_fin: practica.Fecha_fin.split('T')[0],
            Requisitos: practica.Requisitos,
            Fecha_expiracion: practica.Fecha_expiracion.split('T')[0],
            Modalidad: practica.Modalidad,
            Area_practica: practica.Area_practica,
            Jornada: practica.Jornada
        });
        setIsEditMode(true);
    };


    // Manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Manejar la actualización de la práctica
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = {
                ...formData,
                Fecha_inicio: new Date(formData.Fecha_inicio).toISOString(),
                Fecha_fin: new Date(formData.Fecha_fin).toISOString(),
                Fecha_expiracion: new Date(formData.Fecha_expiracion).toISOString(),
            };

            await axiosInstance.put(`/Update-practicas/${selectedPractica.Id}`, updatedFormData);
            setSuccessMessage('La práctica fue actualizada exitosamente');
            setIsEditMode(false);
            fetchPracticas();
        } catch (err) {
            setError('Error al actualizar la práctica: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className={`container mx-auto p-4 ${currentTheme.background} ${currentTheme.text} font-ubuntu`}>
            <h1 className="text-2xl font-bold mb-4">Lista de Prácticas</h1>
            {error && (
                <div className={`border px-4 py-3 rounded mb-4 ${currentTheme.errorAlert}`} role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className={`border px-4 py-3 rounded mb-4 ${currentTheme.successAlert}`} role="alert">
                    {successMessage}
                </div>
            )}
            {!isEditMode ? (
                <table className={`w-full border-collapse ${currentTheme.formBackground}`}>
                    <thead>
                        <tr className={currentTheme.tableHeader}>
                            <th className={`border p-2 ${currentTheme.tableBorder}`}>ID</th>
                            <th className={`border p-2 ${currentTheme.tableBorder}`}>Título</th>
                            <th className={`border p-2 ${currentTheme.tableBorder}`}>Descripcion</th>
                            <th className={`border p-2 ${currentTheme.tableBorder}`}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {practicas.map((practica) => (
                            <tr key={practica.Id} className={currentTheme.tableRow}>
                                <td className={`border p-2 ${currentTheme.tableBorder}`}>{practica.Id}</td>
                                <td className={`border p-2 ${currentTheme.tableBorder}`}>{practica.Titulo}</td>
                                <td className={`border p-2 ${currentTheme.tableBorder}`}>{practica.Descripcion}</td>
                                <td className={`border p-2 ${currentTheme.tableBorder}`}>
                                    <button
                                        onClick={() => handleEdit(practica)}
                                        className={`${actionButtons.edit} text-white font-bold py-1 px-2 rounded mr-2 transition-colors duration-300`}
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(practica.Id)}
                                        className={`${actionButtons.delete} text-white font-bold py-1 px-2 rounded transition-colors duration-300`}
                                    >
                                        <Trash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <form onSubmit={handleUpdate} className={`${currentTheme.formBackground} p-6 rounded shadow-md`}>
                    <h2 className="text-xl font-bold mb-4">Actualizar Práctica</h2>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-4">
                            <label htmlFor={key} className="block text-sm font-medium">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                                type={key.includes('Fecha') ? "date" : "text"}
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                maxLength={key === 'Ubicacion' ? 30 : undefined}
                                className={`mt-1 p-2 border rounded w-full ${currentTheme.formBackground} ${currentTheme.text} ${currentTheme.inputBorder}`}
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className={`${currentTheme.primaryButton} text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                    >
                        Actualizar
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className={`ml-4 ${currentTheme.secondaryButton} text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                    >
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    );
};

export default Dpractica;