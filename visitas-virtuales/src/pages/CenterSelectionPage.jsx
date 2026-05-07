import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useCenter } from '@/hooks/useCenter.js';
import { toast } from 'sonner';
import {
	ArrowLeft,
	Settings,
	Search,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import Button from '@/components/Button.jsx';
import UserDropdown from '../components/UserDropdown';
import Input from '../components/Input.jsx';

export default function CenterSelectionPage() {
	const navigate = useNavigate();
	const hasFetchedRef = useRef(false);

	const { isAdmin, isTeacher } = useAuth();
	const isStaff = isAdmin || isTeacher;
	const {
		allCenters,
		selectedCenter,
		isCentersLoading,
		centersError,
		saveSelectedCenter,
		fetchCenters,
	} = useCenter();

	// Iniciamos el local con lo que haya en el contexto (por si vuelve para cambiar)
	const [localSelectedCenter, setLocalSelectedCenter] = useState(
		selectedCenter || null,
	);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const handleSearchChange = (value) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	useEffect(() => {
		if (
			!hasFetchedRef.current &&
			!isCentersLoading &&
			(!allCenters || allCenters.length === 0)
		) {
			hasFetchedRef.current = true;
			fetchCenters();
		}
	}, [fetchCenters, isCentersLoading, allCenters]);

	useEffect(() => {
		if (isCentersLoading || centersError) return;

		// Si no hay centros, no hacemos nada (el toast se muestra en la Landing)
		if (!allCenters || allCenters.length === 0) return;

		if (!selectedCenter) {
			toast.info('Selecciona un centro para continuar', {
				description: `Es necesario elegir un centro educativo para ${isAdmin || isTeacher ? 'configurar sus POIs y acceder a su tour virtual' : 'acceder al tour virtual'}`,
			});
		}
	}, [
		isCentersLoading,
		centersError,
		allCenters,
		selectedCenter,
		isAdmin,
		isTeacher,
	]);

	const handleConfirm = () => {
		if (localSelectedCenter) {
			// Actualizamos el contexto global (esto permitirá entrar a /viewer)
			saveSelectedCenter(localSelectedCenter);

			toast.success(
				`${isAdmin || isTeacher ? `Seleccionado ${localSelectedCenter.name}` : `Cargando ${localSelectedCenter.name}`}`,
				{
					description: `${isAdmin || isTeacher ? 'Ahora puedes configurar los POIs o acceder al tour virtual' : 'Preparando tour virtual'}`,
				},
			);

			// Redirigimos a la escena de Unity o al gestor de POIs según el rol
			navigate(isAdmin || isTeacher ? '/listpois' : '/viewer');
		}
	};

	// Filtrar y paginar centros
	const filteredCenters = allCenters
		? allCenters.filter((center) =>
				center.name.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: [];

	const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
	const paginatedCenters = filteredCenters.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col gap-4">
			{/* Botón flotante para volver a la Landing (útil para invitados) + dropdown de usuario para logueados */}
			<div
				className="sticky top-0 z-40 h-16 w-full flex items-center justify-between p-4 lg:py-4 lg:px-8 border-b border-transparent
                    bg-slate-50/80 backdrop-blur-xl
                    transition-all pl-1.75!"
			>
				<Link to="/">
					<Button variant="ghost" size="normal">
						<ArrowLeft size={20} />
						<span>Volver a inicio</span>
					</Button>
				</Link>
				{isStaff ? (
					<UserDropdown />
				) : (
					<Link to="/login">
						<Button variant="primary" size="normal" type="button">
							Iniciar sesión
						</Button>
					</Link>
				)}
			</div>

			<main className="flex-1 flex flex-col items-center justify-center p-6 ">
				<div className="w-full max-w-5xl">
					{/* Título */}
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-slate-700 tracking-tight leading-tight">
							¿Qué centro quieres visitar?
						</h1>
						<p className="text-slate-500 mt-2 text-sm max-w-md mx-auto leading-relaxed">
							Selecciona una ubicación para explorar sus instalaciones en el
							tour virtual 360°.
						</p>
					</div>

					{/* Buscador de centros */}
					<div className="mb-8">
						<div className="relative max-w-md mx-auto">
							<Input
								placeholder="Buscar centro por nombre..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							>
								<Search size={18} />
							</Input>
						</div>
					</div>

					{/* ... (Estados de carga y error se mantienen igual) ... */}
					{isCentersLoading && (
						<div className="flex justify-center items-center h-48">
							<div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full" />
						</div>
					)}

					{/* Grid de tarjetas */}
					{!isCentersLoading && !centersError && allCenters && (
						<>
							{filteredCenters.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-slate-500 text-lg leading-relaxed">
										No hay centros que coincidan con &quot;{searchQuery}&quot;
									</p>
								</div>
							) : (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{paginatedCenters.map((center) => {
											const isActive = localSelectedCenter?.id === center.id;
											return (
												<div
													key={center.id}
													onClick={() => setLocalSelectedCenter(center)}
													className={`
														group relative text-left rounded-2xl overflow-hidden bg-white
														border-2 transition-all duration-300 focus:outline-none
														hover:shadow-2xl cursor-pointer flex flex-col
														${isActive ? 'border-navy ring-10 ring-navy/4' : 'border-slate-100 hover:border-navy/40'}
												`}
												>
													{/*Boton de configuracion para admins*/}
													{isAdmin && isActive && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																navigate('/settings', {
																	state: { centerId: center.id },
																});
															}}
															className="cursor-pointer absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors duration-200 backdrop-blur-sm"
														>
															<Settings size={16} />
														</button>
													)}
													{/* Imagen con overlay si está activo */}
													<div className="relative h-40 w-full overflow-hidden">
														{center.imageUrl ? (
															<img
																src={center.imageUrl}
																alt={center.name}
																className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
															/>
														) : (
															<div className="w-full h-full bg-linear-to-br from-navy/6 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
																{center.name.charAt(0)}
															</div>
														)}
														{isActive && <div className="absolute inset-0" />}
													</div>

													<div className="p-5 flex-1 flex flex-col justify-between">
														<div>
															<h2 className="font-bold text-slate-700 text-base mb-1">
																{center.name}
															</h2>
															<p className="text-slate-500 text-xs flex items-center gap-1 leading-relaxed">
																{center.location || 'Ubicación disponible'}
															</p>
														</div>

														{/* Indicador visual de selección */}
														<div className="mt-4 ">
															{isActive ? (
																<Button
																	variant="primary"
																	size="small"
																	className="w-full"
																	onClick={(e) => {
																		e.stopPropagation();
																		handleConfirm();
																	}}
																>
																	Acceder al Centro
																</Button>
															) : (
																<div className="h-9 flex justify-center items-center text-sm font-bold text-slate-100 border-rounded border-slate-400 group-hover:text-navy transition-colors duration-300">
																	Haz clic para seleccionar
																</div>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>

									{/* Controles de paginación */}
									{totalPages > 1 && (
										<div className="flex items-center justify-center gap-4 mt-8">
											<Button
												variant="ghost"
												size="small"
												onClick={() =>
													setCurrentPage((p) => Math.max(1, p - 1))
												}
												disabled={currentPage === 1}
											>
												<ChevronLeft size={18} />
												<span>Anterior</span>
											</Button>
											<span className="text-sm text-slate-500">
												Página {currentPage} de {totalPages}
											</span>
											<Button
												variant="ghost"
												size="small"
												onClick={() =>
													setCurrentPage((p) => Math.min(totalPages, p + 1))
												}
												disabled={currentPage === totalPages}
											>
												<span>Siguiente</span>
												<ChevronRight size={18} />
											</Button>
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
}
