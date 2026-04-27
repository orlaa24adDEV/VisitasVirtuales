import { useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import Button from '@/components/Button.jsx';
import {useAuth} from '@/hooks/useAuth.js';
import { ImageIcon } from 'lucide-react';
import { getLocalStorageAccessToken } from '../helpers/authLocalStorage';

export default function UploadImageForm({ centerId, currentImage }) {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(currentImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const { updateCenterImage } = useAuth();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = getLocalStorageAccessToken();
            const response = await fetch(`/api/centers/${centerId}/image`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const { imageUrl } = data.center;
                updateCenterImage(centerId, imageUrl);
                setFile(null);
                alert('Imagen de centro actualizada exitosamente');
            } else {
                const errorData = await response.text();
                console.error('Error del servidor:', errorData);
                alert(`Error: ${response.status} - No se pudo actualizar la imagen del centro`);
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }  
    };

    const handleClearImage = () => {
        setFile(null);
        setPreview(currentImage || null);
    };

    return (
        <div className="space-y-4">
            <div className="h-40 w-full bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200">
                {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Sin imagen actual</span>
                    </div>
                )}
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            
            <div className="flex gap-2">
                <button 
                    onClick={() => fileInputRef.current.click()}
                    className="cursor-pointer flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <Upload className="w-4 h-4 cursor-pointer" /> {file ? 'Cambiar' : 'Seleccionar'}
                </button>
                
                {file && (
                    <>
                        <button 
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isUploading ? 'Subiendo...' : 'Confirmar'}
                        </button>
                        <button 
                            onClick={handleClearImage}
                            className="cursor-pointer px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
