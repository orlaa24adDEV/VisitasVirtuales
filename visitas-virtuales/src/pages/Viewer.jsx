import { useAuth } from '@/hooks/useAuth.js';
import { useCenterQuery } from '@/hooks/useCenterQuery.js';
import { UserCheck, ShieldCheck, GraduationCap } from 'lucide-react'; // Iconos para darle estilo
import UnityViewer from '../components/UnityViewer';
import { useCenter } from '../hooks/useCenter';

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
						<h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight">
							¡Bienvenido{isAdmin || isTeacher ? ' de nuevo, ' : ' '}
							{user?.username || 'Invitado'}!
						</h1>
						{isAdmin || isTeacher ? (
							<p className="text-gray-500 leading-relaxed">
								Has iniciado sesión como
								<span
									className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
										isAdmin
											? 'bg-navy-muted text-navy border-navy/20'
											: isTeacher
												? 'bg-amber-50 text-amber-700 border-amber-200'
												: 'bg-transparent text-zinc-400 border-zinc-200'
									}`}
								>
									{isAdmin
										? 'Administrador'
										: isTeacher
											? 'Profesor'
											: 'Invitado'}
								</span>
							</p>
						) : null}
					</div>
				</div>

				<hr className="my-4 border-gray-100" />

				<div className="mt-4">
					<p className="text-gray-700 leading-relaxed">
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
					{isAdmin && (
						<p className="mb-4 text-sm font-medium text-navy leading-relaxed">
							Tienes acceso total. Puedes gestionar puntos de interés (POIs),
							ver el historial de auditoría y configurar el sistema.
						</p>
					)}
					{isTeacher && (
						<p className="mb-4 text-sm font-medium text-amber-900 leading-relaxed">
							Como profesor, puedes gestionar tus clases y ver la información de
							los puntos de interés.
						</p>
					)}
					{!isAdmin && !isTeacher && (
						<p className="mb-4 text-sm font-medium text-gray-600 leading-relaxed">
							Puedes explorar el mapa y ver la información de los puntos de
							interés.
						</p>
					)}
					{/* Solo montamos Unity cuando selectedCenter ya tiene valor */}
					{selectedCenter ? (
						<UnityViewer />
					) : (
						<div className="flex items-center justify-center h-40 text-gray-400 leading-relaxed">
							<p className="text-sm italic">Cargando centro...</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
