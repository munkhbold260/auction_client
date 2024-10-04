// Токеныг хадгалах функц
export const setToken = (token, tokenExpiryTime, user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiryTime", tokenExpiryTime);
    localStorage.setItem("user", user);
  }
};

// Токеныг авах функц
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null; // Сервер талд байгаа үед null буцаана
};

// Токеныг устгах функц (logout үед ашиглана)
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("tokenExpiryTime");
    localStorage.removeItem("userid");
    localStorage.removeItem("user");
  }
};

// Нэвтэрсэн эсэхийг шалгах функц
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Токен байвал true, байхгүй бол false буцаана
};
