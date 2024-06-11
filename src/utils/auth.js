export const checkAuth = () => {
  const loggedIn = localStorage.getItem("loggedIn");
  return loggedIn === "true";
};

export const login = () => {
  localStorage.setItem("loggedIn", "true");
};

export const logout = () => {
  localStorage.removeItem("loggedIn");
};
