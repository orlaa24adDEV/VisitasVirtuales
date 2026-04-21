export const setAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const currentTime = Math.floor(Date.now() / 1000);
    
    return currentTime >= (payload.exp - 10);
  } catch (error) {
    return true;
  }
};