import { createContext } from 'react'
import { useState, useEffect, useRef } from 'react'
import {
	setAccessToken,
	removeAccessToken,
	isTokenExpired,
	getAccessToken,
} from '../helpers/auth.js'
import { sleep } from '../helpers/sleep.js'
import { AuthContext } from '@/context/AuthContext.js'
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js'
import LoadingPage from '../components/LoadingPage.jsx'

// Proveedor del contexto. Maneja estado de usuario, autenticación, centros y carga inicial
export const AuthProvider = ({ children }) => {
	// Estado de carga inicial (espera a cargar perfil y centros antes de mostrar la app)
	const [isInitialLoading, setIsInitialLoading] = useState(true)
	const isFirstLoad = useRef(true);
	const [isExiting, setIsExiting] = useState(false) // Para manejar transición al cargar página

  // Perfil del usuario autenticado y token de acceso
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    isUserLoading: false,
    userError: null,
  })

	// Todos los centros disponibles y el centro seleccionado
	const [centerState, setCenterState] = useState({
		allCenters: [],
		isCentersLoading: false,
		centersError: null,
		selectedCenter: null,
	})

	/* ============================= */
	/* ==== Gestión de usuarios ==== */
	/* ============================= */

  // Al hacer login, se guarda el token y se cargan perfil y centros
	const login = async (accessToken) => {
		setAccessToken(accessToken);
		// Ejecutar en paralelo para evitar recargas secuenciales innecesarias
		await Promise.all([
			fetchProfile(accessToken),
			fetchCenters(accessToken)
		]);
	}

  // Carga el perfil del usuario autenticado, renovando tokens si es necesario
	const fetchProfile = async (providedToken = null) => {
		const minimumTimer = !isFirstLoad.current ? sleep(0) : sleep(1200);
		isFirstLoad.current = false;

		try {
			let token = providedToken || (await getValidAccessToken());

			if (token) {
				const res = await fetchWithTimeout(
					'/api/me',
					{ headers: { Authorization: `Bearer ${token}` } },
					5000
				);
				if (!res.ok) throw new Error('Session invalid');
				const data = await res.json();
				setAuthState((prev) => ({ ...prev, user: data.profile }));
			} else {
				setAuthState((prev) => ({ ...prev, user: null }));
			}
		} catch (err) {
			console.error('Profile fetch failed:', err);
			removeAccessToken();
			setAuthState((prev) => ({ ...prev, user: null }));
		} finally {
			await minimumTimer; 
			setIsExiting(true);
			await sleep(600);
			setIsInitialLoading(false);
		}
	};

	/* ============================ */
	/* ==== Gestión de centros ==== */
	/* ============================ */

	
	const saveSelectedCenter = (center) => {
		setCenterState((prev) => ({ ...prev, selectedCenter: center }))
		localStorage.setItem('selectedCenter', JSON.stringify(center))
	}

	const saveAllCenters = (allCenters) => {
		setCenterState((prev) => ({ ...prev, allCenters }))
		localStorage.setItem('allCenters', JSON.stringify(allCenters))
	}

	// Carga la lista de centros, renovando tokens si es necesario
	const fetchCenters = async (providedToken = null) => {
		setCenterState((prev) => ({ ...prev, isCentersLoading: true, centersError: null }));

		try {
			const token = providedToken || (await getValidAccessToken());
			
			const response = await fetchWithTimeout(
				'/api/centers', 
				{ headers: { Authorization: `Bearer ${token}` } }, 
				5000
			);

			if (!response.ok) {
				setCenterState((prev) => ({ ...prev, centersError: 'Error al cargar centros' }));
				throw new Error('Error al cargar centros');
			}

			const data = await response.json();
			setCenterState((prev) => ({ ...prev, allCenters: data.centers }));
		} catch (e) {
			console.error('Error al cargar centros:', e);
			setCenterState((prev) => ({ ...prev, centersError: 'Error de red al cargar centros' }));
		} finally {
			setCenterState((prev) => ({ ...prev, isCentersLoading: false }));
		}
	};
	
	/* =========================================== */
	/* ==== Autenticación y gestión de tokens ==== */
	/* =========================================== */

	const refreshTokens = async () => {
		try {
			const response = await fetchWithTimeout('/api/users/auth/refresh', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Enviar refreshToken (desde cookie HttpOnly)
			}, 5000)

			if (!response.ok) throw new Error('No se pudieron renovar los tokens')
			const data = await response.json()
			setAuthState((prev) => ({ ...prev, accessToken: data.accessToken }))
			return data.accessToken
		} catch (e) {
			console.error('Error al renovar tokens:', e)
			setAuthState((prev) => ({ ...prev, user: null, accessToken: null }))
			return null
		}
	}

	// Helper para obtener un token válido, renovándolo si es necesario
	const getValidAccessToken = async () => {
		const token = getAccessToken()
		if (!token) return null

		if (isTokenExpired(token)) {
			const newToken = await refreshTokens()
			if (!newToken) {
				removeAccessToken()
				return null
			}
			return newToken
		}

		return token
	}

	// Cargar perfil al montar el componente
	useEffect(() => {
			fetchProfile(authState.accessToken)
	}, [])

	const logout = async () => {
		const token = getAccessToken()
		setUser(null)
		setSelectedCenter(null)
		removeAccessToken()

		try {
			await fetch('/api/users/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
		} catch (err) {
			console.error('Logout failed:', err)
		}
	}

	const isAdmin = authState.user?.role === 'admin'
	const isTeacher = authState.user?.role === 'teacher'

	return (
		<AuthContext.Provider
			value={{
				authState,
				centerState,
				login,
				logout,
				fetchProfile,
				fetchCenters,
				saveAllCenters,
				saveSelectedCenter,
				isAdmin,
				isTeacher,
			}}
		>
      {isInitialLoading && <LoadingPage isExiting={isExiting} />}

      <div 
        className={`
          w-full min-h-screen
          transition-opacity duration-1200 ease-in-out
          ${isExiting ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {children}
      </div>
    </AuthContext.Provider>
	)
}

