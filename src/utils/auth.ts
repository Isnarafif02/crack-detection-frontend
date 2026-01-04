// Authentication utility functions

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const getUsername = (): string | null => {
  return localStorage.getItem("username");
};

export const getEmail = (): string | null => {
  return localStorage.getItem("email");
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("crack_result");
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
