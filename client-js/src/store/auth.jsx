import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// Create context
export const AuthContext = createContext();

// Helper function to get token from cookies
const getTokenFromCookies = () => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));
    return cookieValue ? cookieValue.split("=")[1] : null;
};

export const AuthProvider = ({ children }) => {
    useEffect(() => {
        console.log("AuthProvider is initialized");
      }, []);
    const [token, setToken] = useState(getTokenFromCookies());
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRector, setIsRector] = useState(false);
    const [isHighAuth, setIsHighAuth] = useState(false);
    const [isDeveloper, setIsDeveloper] = useState(false);
    const authorizationToken = `Bearer ${token}`;
    // const navigate = useNavigate();

    // Function to store token in cookies
    const storeTokenInCookies = (serverToken) => {
        setToken(serverToken);
        document.cookie = `authToken=${serverToken}; path=/; max-age=3600; secure; samesite=strict`;
    };

    // API URL from environment variables
    const API = import.meta.env.VITE_APP_URI_API;

    // Check if the user is logged in
    let isLoggedIn = !!token;
    console.log("isLoggedIn", isLoggedIn);

    // Logout functionality
    const LogoutUser = () => {
        setToken(null);
        setUser(null);
        setIsAdmin(false);
        setIsDeveloper(false);
        // Remove token from cookies
        document.cookie = "authToken=; path=/; max-age=0";
        toast.success(`Logout Successfully`);

        // Navigate to the home page after a short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 500); // Delay navigation for 2 seconds (2000 ms)

    };

    // JWT Authentication - fetch current logged-in user data
    const userAuthentication = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const response = await fetch(`${API}/api/auth/current/user`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.userData);
            } else {
                console.error("Error fetching user data");
            }
        } catch (error) {
            console.log("Error fetching user data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to handle initial user authentication if token exists
    useEffect(() => {
        if (token) {
            userAuthentication();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        // Reset all role flags first
        setIsAdmin(false);
        setIsRector(false);
        setIsHighAuth(false);
        setIsDeveloper(false);

        // Check and set roles based on the user object
        if (user) {
            const { isRector, isHighAuth,isDeveloper } = user;

            setIsAdmin(isRector || isHighAuth ); // Admin if any of the roles is true
            setIsRector(isRector || false);
            setIsHighAuth(isHighAuth || false);
            setIsDeveloper(isDeveloper || false);
            if(isDeveloper){
                console.log(`This is Developer`);
            }
        }
    }, [user]);


    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                storeTokenInCookies,
                LogoutUser,
                user,
                authorizationToken,
                isLoading,
                isAdmin,
                isRector,
                isHighAuth,
                isDeveloper,
                API,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    // console.log("authContextValue:", authContextValue);    
    if (!authContextValue) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return authContextValue;
};