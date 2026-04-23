import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
import { useNavigate } from 'react-router-dom';

// Proveedor del contexto. Maneja estado de usuario, autenticación, centros y carga inicial
export const AuthProvider = ({ children }) => {
  // Estado de carga inicial (espera a cargar perfil y centros antes de mostrar la app)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const isFirstLoad = useRef(true);
  const CHECK_INTERVAL = 5 * 60 * 1000;
  const lastCheckRef = useRef(Date.now());
  const [isExiting, setIsExiting] = useState(false) // Para manejar transición al cargar página
  const navigate = useNavigate();
  // Perfil del usuario autenticado y token de acceso
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    isUserLoading: false,
    userError: null,
  })

  // Carga inicial de centros desde localStorage al montar el proveedor, para evitar parpadeos y llamadas innecesarias
  const getInitialCenters = () => {
    let allCenters = [];
    let selectedCenter = null;
    try {
      const storedCenters = localStorage.getItem('allCenters');
      if (storedCenters) allCenters = JSON.parse(storedCenters);
      const storedSelected = localStorage.getItem('selectedCenter');
      if (storedSelected) selectedCenter = JSON.parse(storedSelected);
    } catch {
      localStorage.removeItem('allCenters');
      localStorage.removeItem('selectedCenter');
    }
    return {
      allCenters,
      isCentersLoading: false,
      centersError: null,
      selectedCenter,
    };
  };

  const [centerState, setCenterState] = useState(getInitialCenters);

  /* =========================================== */
  /* ==== Autenticación y gestión de tokens ==== */
  /* =========================================== */

  const refreshTokens = useCallback(async () => {
    try {
      const response = await fetchWithTimeout('/api/users/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }, 5000)

      if (!response.ok) throw new Error('No se pudieron renovar los tokens')
      const data = await response.json()
      setAuthState((prev) => ({ ...prev, accessToken: data.accessToken }))
      return data.accessToken
    } catch (e) {
      setAuthState((prev) => ({ ...prev, user: null, accessToken: null }))
      return null
    }
  }, []);

  const getValidAccessToken = useCallback(async () => {
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
  }, [refreshTokens]);

  /* ============================= */
  /* ==== Gestión de usuarios ==== */
  /* ============================= */

  // Carga el perfil del usuario autenticado, renovando tokens si es necesario
  const fetchProfile = useCallback(async (providedToken = null) => {
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
      removeAccessToken();
      setAuthState((prev) => ({ ...prev, user: null }));
    }
  }, [getValidAccessToken]);

  /* ============================ */
  /* ==== Gestión de centros ==== */
  /* ============================ */

  // Carga la lista de centros, renovando tokens si es necesario
  const fetchCenters = useCallback(async (providedToken = null) => {
    setCenterState((prev) => ({ ...prev, isCentersLoading: true, centersError: null }));
    try {
      const token = providedToken || (await getValidAccessToken());
      const response = await fetchWithTimeout(
        '/api/centers',
        { headers: { Authorization: `Bearer ${token}` } },
        5000
      );

      if (!response.ok) throw new Error('Error al cargar centros');

      const data = await response.json();
      lastCheckRef.current = Date.now();
      
      setCenterState((prev) => {
        const prevStr = JSON.stringify(prev.allCenters);
        const newStr = JSON.stringify(data.centers);
        if (prevStr !== newStr) {
          localStorage.setItem('allCenters', newStr);
          return { ...prev, allCenters: data.centers };
        }
        return { ...prev };
      });
    } catch (e) {
      setCenterState((prev) => ({ ...prev, centersError: 'Error de red' }));
    } finally {
      setCenterState((prev) => ({ ...prev, isCentersLoading: false }));
    }
  }, [getValidAccessToken]);

  // Al hacer login, se guarda el token y se cargan perfil y centros solo si no están cargados
  const login = useCallback(async (accessToken) => {
    setIsInitialLoading(true);
    setIsExiting(false);
    
    setAccessToken(accessToken);

    // Evitar re-renders innecesarios cargando perfil y centros en paralelo
    await Promise.all([
      fetchProfile(accessToken),
      fetchCenters(accessToken),
      sleep(1500)
    ]);

    setIsExiting(true);
    await sleep(1000); 
    setIsInitialLoading(false);
  }, [fetchProfile, fetchCenters]);

  const saveSelectedCenter = useCallback((center) => {
    setCenterState((prev) => ({ ...prev, selectedCenter: center }))
    localStorage.setItem('selectedCenter', JSON.stringify(center))
  }, []);

  const saveAllCenters = useCallback((allCenters) => {
    setCenterState((prev) => ({ ...prev, allCenters }))
    localStorage.setItem('allCenters', JSON.stringify(allCenters))
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken()
    setAuthState({ user: null, accessToken: null })
    setCenterState({ allCenters: [], isCentersLoading: false, centersError: null, selectedCenter: null })
    removeAccessToken()
    localStorage.clear();

    setTimeout(() => {
        navigate('/', { replace: true });
    }, 10);

    try {
      await fetch('/api/users/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {}
  }, [navigate, setAuthState, setCenterState]);

  // Cargar perfil y centros al montar solo si no están ya cargados ni en localStorage
  useEffect(() => {
    const init = async () => {
      const needsCenters = !centerState.allCenters || centerState.allCenters.length === 0;
      const expired = lastCheckRef.current + CHECK_INTERVAL < Date.now();

      await Promise.all([
        fetchProfile(),
        (needsCenters || expired) ? fetchCenters() : Promise.resolve(),
        sleep(1200)
      ]);

      setIsExiting(true);
      await sleep(1000);
      setIsInitialLoading(false);
    }
    init();
  }, []);

  const isAdmin = authState.user?.role === 'admin'
  const isTeacher = authState.user?.role === 'teacher'

  // Evitar re-renders innecesarios usando useMemo
  const value = useMemo(() => ({
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
  }), [authState, centerState, login, logout, fetchProfile, fetchCenters, saveAllCenters, saveSelectedCenter, isAdmin, isTeacher]);

  return (
    <AuthContext.Provider value={value}>
      {isInitialLoading && <LoadingPage isExiting={isExiting} />}

      <div 
        className={`
          w-full min-h-screen
          transition-opacity duration-1000 ease-in-out
          ${isExiting ? 'opacity-100' : 'opacity-0'}
          ${isInitialLoading ? 'pointer-events-none' : ''}
        `}
      >
        {children}
      </div>
    </AuthContext.Provider>
  )
}