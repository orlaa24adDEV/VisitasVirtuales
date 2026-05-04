import {
  Search,
  Plus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useCenter } from '../hooks/useCenter';
import Input from '../components/Input';

export default function ListPois({ centerId }) {
    const [pois, setPois] = useState([]);
    const [search, setSearch] = useState("");
    const { selectedCenter } = useCenter();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const GET_PATH = `api/v1/centers/${centerId}/pois`

  const filteredPois = pois.filter((poi) =>
    poi.name.toLowerCase().includes(search.toLowerCase()),
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      const response = await fetch(
        API_URL + `api/v1/centers/${selectedCenter.id}/pois/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        },
      );

      if (response.ok) {
        getPois();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  async function getPois() {
    try {
      const response = await fetch(API_URL + GET_PATH, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      const data = await response.json();
      if (response.ok && !!data) {
        setPois(Array.isArray(data.pois) ? data.pois : []);
      }
    } catch (error) {
      setPois([]);
      console.error("Error al obtener POIs:", error);
    }
  }

  useEffect(() => {
    getPois();
  }, [centerId]);

  //He metido todo el section dentro de un div para centrarlo.
  return (
    <div className="relative flex flex-col items-center justify-center min-h-full w-full py-6 lg:px-12 md:px-10 px-3">
      <section className="flex flex-col gap-3 w-full justify-center min-h-125 max-w-4xl lg:mb-20">
        <div className='flex w-full justify-between items-center'>
          <div className='flex flex-col gap-px w-full'>
            <p className="text-sm flex items-center gap-1 font-medium text-blue-600">
            <MapPin className='w-4 h-4' /><span className="">{selectedCenter.name}</span>
            </p>
            <h2 className='text-xl font-semibold text-slate-800'>
              Gestión de puntos de interés
            </h2>
          </div>
            <Button size='small' onClick={() => navigate("/crud", {
              state: {
                centerId: selectedCenter.name,
                name: "",
                description: "",
                isEditing: false,
              }
            })}>
              <Plus size={18} strokeWidth={3} /> Nuevo POI
            </Button>
        </div>

       
        <div className='p-4 min-w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden'>
          <Input placeholder="Buscador de POI" value={search} onChange={(e) => setSearch(e.target.value)}>
            <Search size={22} className="text-slate-300 ml-2" />
          </Input>
        <div className="overflow-x-auto outline outline-slate-100 rounded-lg bg-slate-50 shadow-sm/8 mt-5">
          <table className="w-full min-w-0 sm:min-w-130 text-sm text-left">
            <thead className="bg-slate-100  text-xs uppercase text-slate-600 font-semibold">
              <tr>
                <th className="px-3 lg:px-6 py-3 lg:py-4">Punto de interés</th>
                <th className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-4 text-ellipsis">Descripción</th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {currentPois.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-slate-500 italic"
                  >
                    No se encontraron puntos de interés
                  </td>
                </tr>
              ) : (
                currentPois.map((poi) => (
                  <tr
                    key={poi.id}
                    className="hover:bg-slate-50/86 transition-colors"
                  >
                    <td className="px-3 lg:px-6 py-3 lg:py-4 font-medium text-slate-900 whitespace-normal">
                      {poi.name}
                    </td>
                    <td className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-4 text-slate-600">
                      {poi.details.description}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-right">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <Link
                          to="/crud"
                          state={{
                            id: poi.id,
                            centerId: selectedCenter.name,
                            name: poi.name,
                            description: poi.details.description,
                            isEditing: true,
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => deletePois(poi.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
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
            <div className="bg-slate-50 px-3 lg:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <p className="text-slate-500 text-xs">
                Mostrando{" "}
                <span className="font-semibold">{firstIndex + 1}</span> -{" "}
                <span className="font-semibold">
                  {Math.min(lastIndex, filteredPois.length)}
                </span>{" "}
                de {filteredPois.length}
              </p>
              <div className="flex items-center gap-2.25">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-medium text-slate-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}
