import React, { useState, useEffect } from 'react'

//import { useAuth } from '../context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

function Crud() {
    const { selectedCenter } = useAuth();
    const [formData, setFormData] = useState({
        id: '',
        centerId: '',
        name: '',
        description: ''
    })

    const location = useLocation();
    const isEditing = location.state?.isEditing;
    
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const UPDATE_PATH = `api/v1/centers/${selectedCenter.id}/pois/${location.state.id}`;
    const CREATE_PATH = `api/v1/centers/${selectedCenter.id}/pois`;

    // Cargar POIs al montar el componente
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        readPois();
    }, [])

    const readPois = () => {
        setFormData(location.state);
    }

    const createPois = async () => {
        if (!selectedCenter) {
            alert("No hay un centro seleccionado");
            return;
        }

        try {
            const response = await fetch(`${API_URL}${CREATE_PATH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify({
                    name: formData.name,
                    details: { description: formData.description }
                })
            });

            if (response.ok) {
                navigate("/listpois")
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updatePois = async () => {
        const response = await fetch(`${API_URL}${UPDATE_PATH}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                name: formData.name,
                details: { description: formData.description }
            })
        });
        if (response.ok) {
            navigate("/listpois");
            resetForm();
        }
    };


    const resetForm = () => {
        setFormData({
            id: '',
            centerId: '',
            name: '',
            description: ''
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEditing) {
            updatePois()
        } else {
            createPois()
        }
    }

    return (
        <main className="p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Puntos de Interés</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                    {isEditing ? 'Editar POI' : 'Crear Nuevo POI'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">Centro:</label>
                        <input
                            type="text"
                            name="centerId"
                            value={formData.centerId || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Ej: MEDAC Málaga"
                            disabled
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Nombre del POI"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Descripción:</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded h-24"
                            placeholder="Descripción del punto de interés"
                            required
                        />
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => {
                                resetForm()
                                navigate('/listpois');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </main>
    )
}

export default Crud