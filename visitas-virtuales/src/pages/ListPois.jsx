import {
  Search,
  Plus,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import CenterBanner from "@/components/CenterBanner.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ListPois({ centerId }) {
  const [pois, setPois] = useState([]);
  const [search, setSearch] = useState("");
  const { selectedCenter } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;
  const GET_PATH = `api/v1/centers/${centerId}/pois`;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="flex flex-col items-center justify-center min-h-full w-full  ">
      <section className="flex flex-col gap-2 w-full max-w-4xl p-2 shadow-sm rounded-2xl bg-white min-h-125">
        <CenterBanner centerName={selectedCenter.name} />
        <div className="flex flex-row gap-2 border-2 border-gray-200 rounded-lg items-center focus-within:border-2 hover:border-blue-600 focus-within:border-blue-600 focus-within:border-solid">
          <Search size={24} className="text-gray-300 ml-2" />
          <input
            type="text"
            placeholder="Buscador de POI"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-1 focus:outline-hidden"
          />
          <Link
            to="/crud"
            state={{
              centerId: selectedCenter.name,
              name: "",
              description: "",
              isEditing: false,
            }}
            className="flex items-center w-45 gap-1 px-3 py-1.5 justify-center text-white text-sm font-medium bg-blue-600 border border-transparent hover:bg-blue-800 rounded-r-md cursor-pointer transition-all"
          >
            <Plus size={18} strokeWidth={3} /> Nuevo POI
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-5">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-4">Punto de interés</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentPois.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-500 italic"
                  >
                    No se encontraron puntos de interés
                  </td>
                </tr>
              ) : (
                currentPois.map((poi) => (
                  <tr
                    key={poi.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {poi.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {poi.details.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/crud"
                          state={{
                            id: poi.id,
                            centerId: selectedCenter.name,
                            name: poi.name,
                            description: poi.details.description,
                            isEditing: true,
                          }}
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
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-gray-500 text-xs">
                Mostrando{" "}
                <span className="font-semibold">{firstIndex + 1}</span> -{" "}
                <span className="font-semibold">
                  {Math.min(lastIndex, filteredPois.length)}
                </span>{" "}
                de {filteredPois.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
