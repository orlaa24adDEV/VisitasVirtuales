import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  setLocalStorageAccessToken,
  getLocalStorageAccessToken,
  removeLocalStorageAccessToken,
  isTokenExpired,
  getLocalStorageUser,
  setLocalStorageUser,
  removeLocalStorageUser,
} from '../helpers/authLocalStorage.js'
import { AuthContext } from '@/context/AuthContext.js'
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js'
import LoadingPage from '../components/LoadingPage.jsx'
import { useNavigate } from 'react-router-dom';

// Proveedor del contexto. Maneja estado de usuario, autenticación, centros y carga inicial
export const AuthProvider = ({ children }) => {
  // Estado de carga inicial (espera a cargar perfil y centros antes de mostrar la app)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false) // Para manejar transición al cargar página
  const [showLoading, setShowLoading] = useState(true); // Controla el montaje de LoadingPage
  const CHECK_INTERVAL = 5 * 60 * 1000;
  const lastCheckRef = useRef(Date.now());
  const loadingStartRef = useRef(Date.now());
  const MIN_LOADING_DURATION = 600;
  const navigate = useNavigate();
  // Perfil del usuario autenticado y token de acceso
  const [authState, setAuthState] = useState({
    user: null,
    isUserLoading: false,
    userError: null,
  })

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
      removeLocalStorageAccessToken()
      removeLocalStorageUser()
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
        removeLocalStorageUser();
      }
    } catch {
      removeLocalStorageAccessToken();
      removeLocalStorageUser();
      setAuthState((prev) => ({ ...prev, user: null }));
    }
  }, [getValidAccessToken]);

  // Al hacer login, se guarda el token y se cargan perfil y centros solo si no están cargados
  const login = useCallback(async (accessToken) => {
    setIsInitialLoading(true);
    setIsExiting(false);
    setShowLoading(true);
    loadingStartRef.current = Date.now();
    setLocalStorageAccessToken(accessToken);
    setAuthState((prev) => ({ ...prev, accessToken }));
    // Evitar re-renders innecesarios cargando perfil y centros en paralelo
    await fetchProfile(accessToken);
    setIsInitialLoading(false);
    // Forzar duración mínima de carga para mostrar animación
    const elapsed = Date.now() - loadingStartRef.current;
    const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);
    setTimeout(() => setIsExiting(true), remaining);
    setTimeout(() => setShowLoading(false), remaining + 1000);
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    const token = getLocalStorageAccessToken();
    setAuthState({ user: null, accessToken: null, isUserLoading: false })
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
  }, [navigate, setAuthState]);

  // Cargar perfil y centros al montar solo si no están ya cargados ni en localStorage
  useEffect(() => {
    const init = async () => {
      const now = Date.now();
      setIsInitialLoading(true);
      setShowLoading(true);
      setIsExiting(false);
      loadingStartRef.current = Date.now();
      const hasStoredToken = Boolean(getLocalStorageAccessToken());
      if (hasStoredToken || now - lastCheckRef.current > CHECK_INTERVAL) {
        await fetchProfile();
        lastCheckRef.current = now;
      }
      setIsInitialLoading(false);
      // Forzar duración mínima de carga
      const elapsed = Date.now() - loadingStartRef.current;
      const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed);
      setTimeout(() => setIsExiting(true), remaining);
      setTimeout(() => setShowLoading(false), remaining + 1000);
    };
    init();
  }, [CHECK_INTERVAL, fetchProfile]);

  const storedToken = getLocalStorageAccessToken();
  const storedUser = storedToken && !isTokenExpired(storedToken) ? getLocalStorageUser() : null;
  const user = authState.user || storedUser || null;

  // Evitar re-renders innecesarios usando useMemo
  const value = useMemo(() => ({
    user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    login,
    logout,
    fetchProfile,
    isInitialLoading,
  }), [user, login, logout, fetchProfile, isInitialLoading]);

  return (
    <AuthContext.Provider value={value}>
      {showLoading && (
        <LoadingPage isExiting={isExiting} />
      )}
      <div
        className={`
          w-full min-h-screen
          transition-opacity duration-1000 ease-in-out
          ${isExiting ? 'opacity-100' : 'opacity-0'}
          ${(isInitialLoading && !isExiting) ? 'pointer-events-none' : ''}
        `}
      >
        {children}
      </div>
    </AuthContext.Provider>
  )
}