import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  setLocalStorageAccessToken,
  getLocalStorageAccessToken,
  removeLocalStorageAccessToken,
  isTokenExpired,
  getLocalStorageUser,
  setLocalStorageUser,
} from '../helpers/authLocalStorage.js'
import { getLocalStorageSelectedCenter, setLocalStorageSelectedCenter, getLocalStorageAllCenters, setLocalStorageAllCenters, removeLocalStorageAllCenters, removeLocalStorageSelectedCenter } from '../helpers/centerLocalStorage.js'
import { sleep } from '../helpers/sleep.js'
import { AuthContext } from '@/context/AuthContext.js'
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js'
import LoadingPage from '../components/LoadingPage.jsx'
import { useNavigate } from 'react-router-dom';

// Proveedor del contexto. Maneja estado de usuario, autenticación, centros y carga inicial
export const AuthProvider = ({ children }) => {
  // Estado de carga inicial (espera a cargar perfil y centros antes de mostrar la app)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const CHECK_INTERVAL = 5 * 60 * 1000;
  const lastCheckRef = useRef(Date.now());
  const [isExiting, setIsExiting] = useState(false) // Para manejar transición al cargar página
  const navigate = useNavigate();
  // Perfil del usuario autenticado y token de acceso
  const [authState, setAuthState] = useState({
    user: null,
    isUserLoading: false,
    userError: null,
  })

  // Carga inicial de centros desde localStorage al montar el proveedor, para evitar parpadeos y llamadas innecesarias
  const getInitialCenters = () => {
    let allCenters = [];
    let selectedCenter = null;
    try {
      const storedCenters = getLocalStorageAllCenters();
      if (storedCenters) allCenters = JSON.parse(storedCenters);
      const storedSelected = getLocalStorageSelectedCenter();
      if (storedSelected) selectedCenter = JSON.parse(storedSelected);
    } catch {
      removeLocalStorageAllCenters();
      removeLocalStorageSelectedCenter();
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
    } catch {
      setAuthState((prev) => ({ ...prev, user: null, accessToken: null }))
      return null
    }
  }, []);

  const getValidAccessToken = useCallback(async () => {
    const token = getLocalStorageAccessToken()
    if (!token) return null

    if (isTokenExpired(token)) {
      const newToken = await refreshTokens()
      if (!newToken) {
        removeLocalStorageAccessToken();
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
        setLocalStorageUser(data.profile);
      } else {
        setAuthState((prev) => ({ ...prev, user: null }));
        removeLocalStorageAccessToken();
      }
    } catch {
      removeLocalStorageAccessToken();
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
      setLocalStorageAllCenters(data.centers);
    } catch {
      setCenterState((prev) => ({ ...prev, centersError: 'Error de red' }));
    } finally {
      setCenterState((prev) => ({ ...prev, isCentersLoading: false }));
    }
  }, [getValidAccessToken]);

  // Actualizar la imagen de un centro específico en estado local después de subirla
  const updateCenterImage = useCallback((centerId, imageUrl) => {
      const id = Number(centerId);
      setCenterState((prev) => {
          const updatedCenters = prev.allCenters.map(c =>
              c.id === id ? { ...c, imageUrl } : c
          );
          const updatedSelected = prev.selectedCenter?.id === id
              ? { ...prev.selectedCenter, imageUrl }
              : prev.selectedCenter;

          localStorage.setItem('allCenters', JSON.stringify(updatedCenters));
          localStorage.setItem('selectedCenter', JSON.stringify(updatedSelected));

          return { ...prev, allCenters: updatedCenters, selectedCenter: updatedSelected };
      });
  }, []);

  // Al hacer login, se guarda el token y se cargan perfil y centros solo si no están cargados
  const login = useCallback(async (accessToken) => {
    setIsInitialLoading(true);
    setIsExiting(false);
    
    setLocalStorageAccessToken(accessToken);
    setAuthState((prev) => ({ ...prev, accessToken }));

    // Evitar re-renders innecesarios cargando perfil y centros en paralelo
    await Promise.all([
      fetchProfile(accessToken),
      fetchCenters(accessToken),
    ]);

    setIsExiting(true);
    setIsInitialLoading(false);
  }, [fetchProfile, fetchCenters]);

  const saveSelectedCenter = useCallback((center) => {
    setCenterState((prev) => ({ ...prev, selectedCenter: center }))
    setLocalStorageSelectedCenter(center);
  }, []);

  const saveAllCenters = useCallback((allCenters) => {
    setCenterState((prev) => ({ ...prev, allCenters }))
    localStorage.setItem('allCenters', JSON.stringify(allCenters))
  }, []);

  const logout = useCallback(async () => {
    const token = getLocalStorageAccessToken();
    setAuthState({ user: null, accessToken: null, isUserLoading: false })
    setCenterState({ allCenters: [], isCentersLoading: false, centersError: null, selectedCenter: null })
    removeLocalStorageAccessToken();
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
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
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


  // Evitar re-renders innecesarios usando useMemo
  const value = useMemo(() => ({
    user: authState.user || getLocalStorageUser() || null,
    allCenters: centerState.allCenters || getLocalStorageAllCenters() || [],
    selectedCenter: centerState.selectedCenter || getLocalStorageSelectedCenter() || null,
    isCentersLoading: centerState.isCentersLoading,
    centersError: centerState.centersError,
    isAdmin: authState.user?.role === 'admin',
    isTeacher: authState.user?.role === 'teacher',
    login,
    logout,
    fetchProfile,
    fetchCenters,
    saveAllCenters,
    saveSelectedCenter,
    updateCenterImage,
    isInitialLoading,
  }), [
    authState.user,
    centerState.allCenters,
    centerState.selectedCenter,
    centerState.isCentersLoading,
    centerState.centersError,
    login,
    logout,
    fetchProfile,
    fetchCenters,
    saveAllCenters,
    saveSelectedCenter,
    updateCenterImage,
    isInitialLoading,
  ]);

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