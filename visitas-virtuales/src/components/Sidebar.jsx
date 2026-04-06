import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
	Home,
	User,
	Mail,
	Menu,
	LayoutDashboard,
	Building2,
	MapPin,
	ClipboardCheck,
	X,
} from 'lucide-react';
import logo1 from '@/assets/logo1.png';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
	// Estado para saber si está expandida o contraída
	const [isExpanded, setIsExpanded] = useState(true);

	const menuItems = [
		{ id: 'inicio', name: 'Inicio', icon: <Home size={20} />, path: 'login' },
		{ id: 'perfil', name: 'Perfil', icon: <User size={20} />, path: 'perfil' },
		{ id: 'mensajes', name: 'Mensajes', icon: <Mail size={20} />, path: 'mensajes' },
		{ id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/crud' },
		{ id: 'seleccion-centro', name: 'Selección de Centro', icon: <Building2 size={22} />, path: '/centros'},
		{ id: 'gestion-pois', name: 'Gestión de POIs', icon: <MapPin size={22} />, path: 'listpois' },
		{ id: 'auditoria', name: 'Auditoría', icon: <ClipboardCheck size={22} />, path: '/historial' },
	];

	return (

		<>

			{/* OVERLAY: Capa oscura que aparece solo en móvil cuando el menú está abierto */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}



			{/* SIDEBAR PRINCIPAL */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-blue-600 text-white shadow-lg transition-all duration-300 lg:relative
					${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
					${isExpanded ? 'w-64' : 'w-20'}`}>
				{/*Cabecera del sidebar*/}
				<div className="flex flex-col items-center gap-2 border-b border-blue-500 p-6 relative">
					{/* Botón de cerrar (X) solo visible en móvil */}
					<button 
						className="absolute top-4 right-4 lg:hidden p-1 hover:bg-blue-700 rounded"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<X size={20} />
					</button>
					<img
						src={logo1}
						alt="Icono"
						className="h-12 w-12 object-contain rounded-lg"
					/>

					{/*Texto davante que se contrae */}
					<span
						className={`font-bold text-xl tracking-widest whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : ' lg:opacity-0 lg:invisible'}`}>
						DAVANTE
					</span>
				</div>

				{/*Lista de Navegación */}
				<nav className="flex-1 px-4 py-6 space-y-3">
					{menuItems.map((item) => (
						<NavLink
							key={item.id}
							to={item.path}
							onClick={() => {
								// En móvil, cerramos el menú al hacer click en una opción
								if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
							}}
							className={({isActive}) =>`flex w-full items-center rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 
								${isActive ? 'bg-white text-blue-600 shadow-md font-bold' : 'hover:bg-blue-700 text-blue-100 hover:text-white'}
								${isExpanded ? 'justify-start gap-4' : 'lg:justify-center'}`}>
							<div className="shrink-0">{item.icon}</div>
							<span
								className={`font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
								${isExpanded ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0'}`}>
								{item.name}
							</span>
						</NavLink>
					))}
				</nav>

				{/* Pie de la barra lateral */}
				<div className="hidden lg:block border-t border-blue-500 p-4">
					<div className="flex items-center justify-center">
						{/* El botón de menú siempre presente */}
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className="hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors"
							title="Expandir/Contraer">
							<Menu size={24} />
						</button>
					</div>
				</div>
			</aside>

		</>
	);
};

export default Sidebar;
