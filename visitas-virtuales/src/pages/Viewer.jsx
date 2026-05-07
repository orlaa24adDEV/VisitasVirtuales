import { useAuth } from '@/hooks/useAuth.js';
import { useCenterQuery } from '@/hooks/useCenterQuery.js';
import { UserCheck, ShieldCheck, GraduationCap, MapPin } from 'lucide-react';
import UnityViewer from '../components/UnityViewer';
import { useCenter } from '../hooks/useCenter';
import { useWindowSize } from '../hooks/useWindowSize.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Viewer() {
	const { user, isAdmin, isTeacher } = useAuth();
	const { selectedCenter } = useCenter();
	const windowSize = useWindowSize();

	useCenterQuery();

	return (
		<div
			className={`lg:p-8 mx-auto w-full py-6 lg:px-12 lg:py-20 md:px-10 px-3 flex flex-col gap-4! justify-center max-w-5xl! ${!user ? 'max-w-380' : ''}`}
		>
			<PageHeader
				title="Visita 360°"
				contextText={selectedCenter.name}
				contextIcon={<MapPin className="w-4 h-4" />}
			/>

			<div className="lg:p-6 overflow-hidden bg-white border rounded-xl shadow-xl/6 border-slate-100">
				{windowSize.width >= 640 && (
					<>
						<div className="flex items-center gap-4 mb-4">
							<div
								className={`p-3 rounded-full transition-colors ${
									isAdmin
										? 'bg-navy-muted text-navy'
										: isTeacher
											? 'bg-amber-100 text-amber-600'
											: 'bg-gray-100 text-slate-400'
								}`}
							>
								{isAdmin ? (
									<ShieldCheck size={32} />
								) : isTeacher ? (
									<GraduationCap size={32} />
								) : (
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

						{isAdmin && (
							<p className="mb-4 text-sm font-medium text-navy leading-relaxed">
								Tienes acceso total. Puedes gestionar puntos de interés (POIs),
								ver el historial de auditoría y configurar el sistema.
							</p>
						)}
						{isTeacher && (
							<p className="mb-4 text-sm font-medium text-amber-900 leading-relaxed">
								Como profesor, puedes gestionar tus clases y ver la información
								de los puntos de interés.
							</p>
						)}
						{!isAdmin && !isTeacher && (
							<p className="mb-4 text-sm font-medium text-gray-600 leading-relaxed">
								Puedes explorar el mapa y ver la información de los puntos de
								interés.
							</p>
						)}
					</>
				)}

				{selectedCenter ? (
					<UnityViewer />
				) : (
					<div className="flex items-center justify-center h-40 text-gray-400 leading-relaxed">
						<p className="text-sm italic">Cargando centro...</p>
					</div>
				)}
			</div>
		</div>
	);
}
