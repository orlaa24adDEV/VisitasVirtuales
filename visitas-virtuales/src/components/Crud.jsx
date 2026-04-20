import React, { useState, useEffect } from 'react'
import CenterBanner from './CenterBanner';

//import { useAuth } from '../context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

function Crud() {
    const { selectedCenter } = useAuth();
    const [formData, setFormData] = useState({
        id: '',
        centerId: '',
        name: '',
        description: ''
    });

    const location = useLocation();
    const state = location.state || {};
    const isEditing = !!state.isEditing;

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const UPDATE_PATH = `api/v1/centers/${selectedCenter.id}/pois/${location.state.id}`;
    const CREATE_PATH = `api/v1/centers/${selectedCenter.id}/pois`;

    // Cargar POIs al montar el componente
    useEffect(() => {
        if (isEditing && state) {
            setFormData({
                id: state.id || '',
                centerId: state.centerId || '',
                name: state.name || '',
                description: state.description || state.details?.description || ''
            });
        }
    }, [isEditing, state]);

    const createPois = async () => {
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
                toast.success('POI creado con éxito', { description: "Redirigiendo a la lista de POIs..." });
                navigate("/listpois")
                resetForm();
            } else {
                toast.error('Error al crear el POI', { description: "Inténtalo de nuevo más tarde" });
            }
        } catch (error) {
            toast.error('Error de red', { description: "No se pudo conectar con el servidor, inténtalo de nuevo más tarde" });
            console.error('Error:', error);
        }
    };

    const updatePois = async () => {
        try {
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
                toast.success('POI actualizado con éxito', { description: "Redirigiendo a la lista de POIs..." });
                navigate("/listpois");
                resetForm();
            } else {
                toast.error('Error al actualizar el POI', { description: "Inténtalo de nuevo más tarde" });
            }
        } catch (error) {
            toast.error('Error de red, { description: "No se pudo conectar con el servidor" }');
            console.error('Error:', error);
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
        <main className="p-6 flex-col flex gap-2">
            <h2 className="text-2xl font-bold mb-6">Gestionar Puntos de Interés</h2>
            <CenterBanner centerName={selectedCenter.name} />
            {/* Formulario */}
            <form action={handleSubmit} onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                    {isEditing ? 'Editar POI' : 'Crear Nuevo POI'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
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