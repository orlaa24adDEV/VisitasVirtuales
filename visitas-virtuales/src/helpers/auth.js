export const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
};
export const setAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};