import { useAuth } from '@/hooks/useAuth.js';
import { useCenterQuery } from '@/hooks/useCenterQuery.js';
import { UserCheck, ShieldCheck, GraduationCap } from 'lucide-react'; // Iconos para darle estilo
import UnityViewer from '../components/UnityViewer';
import { useCenter } from '../hooks/useCenter';

//tooltip de informacion
function InfoIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12"/>
				<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	);
}

export default function Viewer() {
	const { user, isAdmin, isTeacher } = useAuth();
	const { selectedCenter } = useCenter();

	// Si el context no contiene un centro, utilizar el query param "center" de la URL,
	// proporcionado por la página de selección de centro. Esto es un fallback y además
	// permite compartir URLs directas a centros específicos.
	useCenterQuery();

	return (
		<div className={`p-8 mx-auto ${!user ? 'max-w-380' : ''}`}>
			<div className="p-6 bg-white border rounded-xl shadow-xl/6 border-slate-100">
				<div className="flex items-center gap-4 mb-4">
					{/* Icono dinámico según el rol */}
					<div
						className={`p-3 rounded-full transition-colors ${
							isAdmin
								? 'bg-navy-muted text-navy'
								: isTeacher
									? 'bg-amber-100 text-amber-600'
									: 'bg-gray-100 text-slate-400'
						}`}
					>
						{/* 1. Si es Admin, SOLO esto */}
						{isAdmin ? (
							<ShieldCheck size={32} />
						) : isTeacher ? (
							/* 2. Si no es Admin pero es Profe, SOLO esto */
							<GraduationCap size={32} />
						) : (
							/* 3. Si no es ninguno de los anteriores, SOLO esto */
							<UserCheck size={32} />
						)}
					</div>

					<div className="space-y-1">
						<h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-800">
							¡Bienvenido{isAdmin || isTeacher ? ' de nuevo, ' : ' '}
							{user?.username || 'Invitado'}!
						</h1>
						
						{isAdmin || isTeacher ? (
							<p className="flex items-center gap-2 leading-relaxed text-gray-500">
								Has iniciado sesión como
								<span
									className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
										isAdmin
											? 'bg-navy-muted text-navy border-navy/20'
											: 'bg-amber-50 text-amber-700 border-amber-200'
									}`}
								>
									{isAdmin ? 'Administrador' : 'Profesor'}
								</span>

								{/* Icono de info con tooltip */}
								<span className="relative group">
									<span
										className={`cursor-default inline-flex items-center justify-center ${
											isAdmin ? 'text-navy' : 'text-amber-600'
										}`}
									>
										<InfoIcon />
									</span>
									
									<span
										className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 w-110 p-3 text-sm rounded-lg shadow-lg border
											opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
											${isAdmin
												? 'text-navy bg-white border-navy/20'
												: 'text-amber-900 bg-white border-amber-200'
											}`}
									>
										{isAdmin
											? 'Tienes acceso total. Puedes gestionar puntos de interés (POIs), ver el historial de auditoría y configurar el sistema.'
											: 'Como profesor, puedes gestionar tus clases y ver la información de los puntos de interés.'
										}
									</span>
								</span>
							</p>
						) : (
							/* Invitado: tooltip de información */
							<div className="relative group">
								<span className="inline-flex items-center gap-1.5 text-xs text-gray-400 cursor-default select-none">
									<InfoIcon />
									Información
								</span>
								<span className="absolute z-10 p-3 text-sm text-gray-600 transition-opacity duration-200 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 pointer-events-none left-6 top-1/2 w-96 group-hover:opacity-100">
									Puedes explorar el mapa y ver la información de los puntos de interés.
								</span>
							</div>
						)}
					</div>
					
				</div>

				<hr className="my-4 border-gray-100" />

				<div className="mt-4">
					<p className="leading-relaxed text-gray-700">
						Actualmente estás visualizando el centro:
						<span className="ml-1 font-bold text-navy">
							{selectedCenter?.name || 'Ninguno seleccionado'}
						</span>
					</p>
				</div>

				{/* Mensaje de ayuda dinámico */}
				<div
					className={`flex flex-col items-center h-full mt-6 p-4 rounded-lg border-l-4 transition-colors ${
						isAdmin
							? 'bg-navy-muted border-navy/20'
							: isTeacher
								? 'bg-amber-50 border-amber-300'
								: 'bg-gray-50 border-gray-300'
					}`}
				>
	
					
					{/* Solo montamos Unity cuando selectedCenter ya tiene valor */}
					{selectedCenter ? (
						<UnityViewer />
					) : (
						<div className="flex items-center justify-center h-40 leading-relaxed text-gray-400">
							<p className="text-sm italic">Cargando centro...</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
