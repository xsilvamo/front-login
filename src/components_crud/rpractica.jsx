import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Rpractica = () => {
    const [practicas, setPracticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    // Configurar axios para usar el token de las cookies
    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    useEffect(() => {
        const fetchPracticas = async () => {
            try {
                // Obtener el token de las cookies
                const token = Cookies.get('authToken');

                // Configurar los headers con el token
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };

                const response = await axios.get('http://localhost:8080/Get-practicas', config);
                console.log(response.data);
                setPracticas(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                if (err.response?.status === 401) {
                    setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
                } else {
                    setError('Error al obtener las prácticas');
                }
                setLoading(false);
            }
        };

        fetchPracticas();
    }, []);

    const handleApply = async (practicaId) => {
        try {
            const token = Cookies.get('authToken');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.post(`http://localhost:8080/Rpracticas/${practicaId}/apply`, {}, config);
            alert('Solicitud enviada con éxito');
        } catch (err) {
            console.error('Error:', err);
            if (err.response?.status === 401) {
                alert('Sesión expirada. Por favor, vuelve a iniciar sesión.');
            } else {
                alert('Error al enviar la solicitud');
            }
        }
    };

    const filteredPracticas = practicas.filter(practica =>
        practica.Titulo.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-4">Cargando prácticas...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Prácticas Disponibles</h1>
            <input
                type="text"
                placeholder="Buscar prácticas..."
                className="w-full p-2 mb-4 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            {filteredPracticas.length === 0 ? (
                <p className="text-center py-4">No hay prácticas disponibles que coincidan con tu búsqueda.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPracticas.map((practica) => (
                        <div key={practica.ID} className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">{practica.Titulo}</h2>
                            <p className="text-gray-600 mb-2">Empresa: {practica.Id_Empresa}</p>
                            <p className="text-gray-600 mb-2">Ubicación: {practica.Ubicacion || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Fecha de inicio: {practica.Fecha_inicio || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Fecha de fin: {practica.Fecha_fin || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Requisitos: {practica.Requisitos || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Modalidad: {practica.Modalidad || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Área de práctica: {practica.Area_practica || 'No disponible'}</p>
                            <p className="text-gray-600 mb-2">Jornada: {practica.Jornada || 'No disponible'}</p>
                            <button
                                onClick={() => handleApply(practica.ID)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Solicitar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rpractica;