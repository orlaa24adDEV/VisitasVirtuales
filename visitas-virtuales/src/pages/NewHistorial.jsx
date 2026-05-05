import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../helpers/fetchWithAuth.js';
import { useAuth } from '../hooks/useAuth.js';
import { toast } from 'sonner';
import { History, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCenter } from '../hooks/useCenter.js';

export default function NewHistorial() {
	const [poiHistory, setPoiHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const { logout } = useAuth();
	const { saveSelectedCenter, allCenters } = useCenter();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPoiHistory = async () => {
			try {
				const response = await fetchWithAuth(
					'/api/audit/poi-history',
					{ method: 'GET' },
					logout,
				);
				if (!response.ok) {
					toast.error('Error al cargar el historial de POIs');
					return;
				}
				const data = await response.json();
				setPoiHistory(Array.isArray(data.history) ? data.history : []);
			} catch (error) {
				console.error('Error fetching POI history:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchPoiHistory();
	}, [logout]);

	if (loading)
		return (
			<div className="flex h-full items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
					<p className="italic text-slate-500">
						Obteniendo los últimos cambios...
					</p>
				</div>
			</div>
		);

	// Seleccionar centro relacionado al cambio y redirigir a la lista de POIs de ese centro
	const handleEntryClick = (entry) => {
		console.log('Entry clicked:', entry);
		if (!entry.poi || !entry.poi.center) {
			toast.error('No se pudo determinar el centro de este cambio');
			return;
		}
		saveSelectedCenter(
			allCenters.find((c) => c.id === entry.details.oldValue.centerId) || null,
		);
		navigate(`/listpois`);
	};

	return (
		<div className="relative flex flex-col items-center justify-center min-h-full w-full py-6 lg:py-20 lg:px-12 md:px-10 px-3">
			<section className="flex flex-col gap-6 w-full justify-center lg:justify-start min-h-125 max-w-4xl">
				<div className="flex flex-col w-full justify-between items-center lg:items-start gap-1 p-2 lg:p-0">
					<h1 className="text-xl lg:text-2xl font-semibold text-slate-800 flex items-center gap-2">
						Historial de Auditoría
						<span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
							Live
						</span>
					</h1>
					<div className="flex items-center gap-2">
						<p className="text-slate-500 text-sm font-base lg:font-medium flex items-center gap-1">
							Últimos cambios en los puntos de interés
						</p>
					</div>
				</div>

				{poiHistory.length > 0 ? (
					<div className="relative border-l-2 border-blue-200 ml-4 md:ml-6">
						{poiHistory.map((entry, idx) => {
							const oldV =
								entry.details?.oldValue ?? entry.details?.before ?? {};
							const newV =
								entry.details?.newValue ?? entry.details?.after ?? {};
							const nameOld = oldV?.name ?? entry.poi?.name ?? '—';
							const nameNew = newV?.name ?? entry.poi?.name ?? '—';
							const descOld =
								oldV?.details?.description ?? oldV?.description ?? '—';
							const descNew =
								newV?.details?.description ?? newV?.description ?? '—';
							const centerName =
								entry.poi?.center?.name ?? 'Centro desconocido';

							return (
								<div
									key={entry.id}
									className="mb-10 ml-6 group"
									onClick={() => handleEntryClick(entry)}
								>
									{/* Punto de la línea de tiempo con efecto hover */}
									<span className="absolute flex items-center justify-center w-4 h-4 bg-white border-2 border-blue-600 rounded-full -left-2.25 group-hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"></span>

									<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
										{/* Header con información del centro */}
										<div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
											<MapPin size={18} className="text-blue-600 shrink-0" />
											<h3 className="text-lg font-semibold text-slate-800">
												{centerName}
											</h3>
											<span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
												{(entry.action || 'UNKNOWN').toUpperCase()}
											</span>
										</div>

										{/* Fecha y hora */}
										<div className="flex justify-between items-start gap-4 mb-4">
											<div className="flex gap-2 items-center">
												<div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
													{new Date(entry.timestamp).toLocaleDateString()}
												</div>
												<div className="text-xs text-slate-400">
													{new Date(entry.timestamp).toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</div>
											</div>

											<div className="text-right">
												<div className="text-[10px] text-slate-300 font-mono">
													ID: {entry.id}
												</div>
											</div>
										</div>

										{/* Cambios antes y después */}
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
											<div className="md:col-span-2 grid grid-cols-2 gap-4">
												<div className="p-3 rounded border border-slate-100 bg-slate-50">
													<div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
														<span>Antes</span>
													</div>
													<div className="font-semibold text-slate-800 text-ellipsis line-clamp-1">
														{nameOld}
													</div>
													<div className="text-sm text-slate-500 mt-2 text-ellipsis line-clamp-2 min-h-10">
														{descOld}
													</div>
												</div>

												<div className="p-3 rounded border border-slate-100 bg-blue-50/30">
													<div className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
														<span>Después</span>
													</div>
													<div className="font-semibold text-slate-800 text-ellipsis line-clamp-1">
														{nameNew}
													</div>
													<div className="text-sm text-slate-500 mt-2 text-ellipsis line-clamp-2 min-h-10">
														{descNew}
													</div>
												</div>
											</div>

											{/* Usuario y razón */}
											<div className="flex flex-col items-start gap-3 pt-2">
												<div className="flex items-center gap-2 w-full">
													<img
														src={
															entry.user?.imageUrl ||
															'https://github.com/identicons/j.png'
														}
														className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0"
														alt="avatar"
													/>
													<div className="min-w-0 flex-1">
														<div className="text-sm font-semibold text-slate-700 truncate">
															{entry.user?.username ?? 'Usuario desconocido'}
														</div>
														<div className="text-xs text-slate-400">
															Modificó este POI
														</div>
													</div>
												</div>

												{entry.details?.reason && (
													<div className="w-full p-2 bg-slate-50 rounded border border-slate-100 h-full">
														<div className="text-xs font-medium text-slate-500 mb-1">
															Razón
														</div>
														<p className="text-xs text-slate-600 italic">
															{entry.details.reason}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center gap-4 py-10">
						<History size={48} className="text-slate-300" />
						<p className="text-slate-400">No hay cambios registrados.</p>
					</div>
				)}

				<div className="text-center py-6">
					<p className="text-sm text-slate-400 italic">
						Nota: Solo se muestran los últimos 20 cambios.
					</p>
				</div>
			</section>
		</div>
	);
}
