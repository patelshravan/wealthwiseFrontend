import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem("token");
        return { token, isAuthenticated: !!token };
    });

    const login = (data) => {
        localStorage.setItem("token", data.token);
        setAuth({ token: data.token, isAuthenticated: true });
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setAuth({ token: null, isAuthenticated: false });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);