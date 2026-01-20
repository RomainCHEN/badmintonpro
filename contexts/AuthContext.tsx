import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, getSession, onAuthStateChange, signIn, signUp, signOut } from '../services/authService';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            const { user: currentUser } = await getSession();
            setUser(currentUser);
            setLoading(false);
        };
        initAuth();

        // Subscribe to auth changes
        const { unsubscribe } = onAuthStateChange((newUser) => {
            setUser(newUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { user: authUser, error } = await signIn(email, password);
        if (authUser) {
            setUser(authUser);
        }
        return { error };
    };

    const register = async (email: string, password: string, name?: string) => {
        const { user: authUser, error } = await signUp(email, password, name);
        if (authUser) {
            setUser(authUser);
        }
        return { error };
    };

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
