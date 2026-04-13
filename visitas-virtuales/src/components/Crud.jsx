import React, { useState, useEffect } from 'react'

//import { useAuth } from '../context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

function Crud() {
    const { selectedCenter } = useAuth();
    const [pois, setPois] = useState([])
    const [formData, setFormData] = useState({
        id: '',
        centerId: '',
        name: '',
        description: ''
    })
    const [isEditing, setIsEditing] = useState(false)

    const API_URL = 'http://localhost:5000/api/pois';

    // Cargar POIs al montar el componente
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        readPois()
    }, [])

    const readPois = async () => {
        try {
            const response = await fetch(API_URL)
            const data = await response.json()
            setPois(data)
        } catch (error) {
            console.error('Error al obtener POIs:', error)
        }
    }

    
    
    const createPois = async () => {
        if (!selectedCenter) {
            alert("No hay un centro seleccionado");
            return;
        }

        try {
            const newPoi = {
                name: formData.name,
                description: formData.description,
                centerId: selectedCenter.id 
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoi)
            });

            if (response.ok) {
                readPois(); 
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    

    const updatePois = async () => {
        const response = await fetch(`${API_URL}/${formData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, centerId: selectedCenter.id })
        });
        if (response.ok) {
            readPois();
            resetForm();
            setIsEditing(false);
        }
    };

    const deletePois = async (id) => {
        try {
        
        const url = `http://localhost:5000/api/pois/${id}?centerId=${selectedCenter.id}`;
        const response = await fetch(url, { method: 'DELETE' });
        
        if (response.ok) {
            readPois();
        }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };


    const editPoi = (poi) => {
        setFormData(poi)
        setIsEditing(true)
    }

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
                        value={formData.centerId}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Ej: MEDAC Málaga"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                        value={formData.description}
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
                            setIsEditing(false)
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>

        {/* Tabla */}
        <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Centro ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {pois.filter(poi => poi.centerId === selectedCenter?.id) .map((poi) => (
                    <tr key={`${poi.centerId}-${poi.id}`} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{poi.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{poi.centerId}</td>
                        <td className="border border-gray-300 px-4 py-2">{poi.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{poi.description}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <button
                                onClick={() => editPoi(poi)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => deletePois(poi.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {pois.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay puntos de interés registrados.</p>
        )}
    </main>
  )
}

export default Crud