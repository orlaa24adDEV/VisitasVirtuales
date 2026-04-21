import { Search, Plus, Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CenterBanner from "@/components/CenterBanner.jsx";
import { Link } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth.js';
import { toast } from 'sonner';
import  Button  from '@/components/Button.jsx';
import Input from '../components/Input';

export default function ListPois({ centerId }) {
    const [pois, setPois] = useState([]);
    const [search, setSearch] = useState("");
    const { centerState } = useAuth();
    const { selectedCenter } = centerState;

    const API_URL = import.meta.env.VITE_API_URL;
    const GET_PATH = `api/v1/centers/${centerId}/pois`

    const filteredPois = pois.filter((poi) =>
        poi.name.toLowerCase().includes(search.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredPois.length / itemsPerPage);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentPois = filteredPois.slice(firstIndex, lastIndex);

    useEffect(() => {
        const maxPage = Math.max(1, totalPages);

        if (currentPage > maxPage) {
             
            setCurrentPage(maxPage);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
         
        setCurrentPage(1);
    }, [search]);

    const deletePois = async (id) => {
        try {
            const response = await fetch(API_URL + `api/v1/centers/${selectedCenter.id}/pois/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                },
            });

            if (response.ok) {
                toast.success('POI eliminado con éxito', { description: 'El punto de interés ha sido eliminado correctamente' });
                getPois();
            }
        } catch (error) {
            toast.error('Error al eliminar el POI', { description: 'No se ha podido eliminar el punto de interés, inténtalo de nuevo más tarde' });
            console.error('Error al eliminar:', error);
        }
    };

    async function getPois() {
        try {
            const response = await fetch(API_URL + GET_PATH, {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') }
            });
            const data = await response.json();
            if (response.ok && !!data) {
                setPois(Array.isArray(data.pois) ? data.pois : []);
            } else {
                setPois([]);
                toast.error('Error al cargar los POIs', { description: 'No se han podido cargar los puntos de interés, inténtalo de nuevo más tarde' });
                console.error('Error al obtener POIs:', data);
            }
        } catch (error) {
            setPois([]);
            toast.error('Error de red', { description: 'No se han podido cargar los puntos de interés, inténtalo de nuevo más tarde' });
            console.error('Error al obtener POIs:', error);
        }
    }

    useEffect(() => {
        getPois();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centerId]);

    //He metido todo el section dentro de un div para centrarlo.
    return (
        <div className="flex flex-col items-center justify-center min-h-full w-full p-6">
            <section className="flex flex-col gap-2 w-full max-w-4xl p-5 shadow-sm rounded-2xl bg-white min-h-125">
                <CenterBanner centerName={selectedCenter.name} />
                    <Input name="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscador de POI">
                        <Search size={20} className="text-slate-400 ml-3 transition-colors" />
                        <Link
                        to="/crud"
                        state={{ centerId: selectedCenter.name, name: '', description: '', isEditing: false }}
                        >
                            <Button variant="primary" size="normal" className="flex items-center gap-1 rounded-l-none">
                                <Plus size={18} strokeWidth={3} />
                                Nuevo POI
                            </Button>
                        </Link>
                    </Input>
                <div className="overflow-hidden rounded-lg outline outline-slate-200 shadow-sm/8 mt-5">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Punto de interés</th>
                                <th className="px-6 py-4">Descripción</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {currentPois.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic">
                                        No se encontraron puntos de interés
                                    </td>
                                </tr>
                            ) : (
                                currentPois.map((poi) => (
                                    <tr key={poi.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{poi.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{poi.details.description}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to="/crud"
                                                    state={{ id: poi.id, centerId: selectedCenter.name, name: poi.name, description: poi.details.description, isEditing: true }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deletePois(poi.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {filteredPois.length > 0 && (
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                            <p className="text-slate-500 text-xs">
                                Mostrando <span className="font-semibold">{firstIndex + 1}</span> - <span className="font-semibold">{Math.min(lastIndex, filteredPois.length)}</span> de {filteredPois.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button size='small' variant='outline' onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft size={18} />
                                </Button>
                                <span className="text-xs font-medium text-slate-700">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button size='small' variant='outline' onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}