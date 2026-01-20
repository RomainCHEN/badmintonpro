import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Default admin credentials - in production, these should be environment variables
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
};

interface AdminUser {
    username: string;
    role: 'admin';
    loginTime: string;
}

interface AdminAuthContextType {
    admin: AdminUser | null;
    isAdminAuthenticated: boolean;
    loading: boolean;
    adminLogin: (username: string, password: string) => Promise<{ success: boolean; error: string | null }>;
    adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

interface AdminAuthProviderProps {
    children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing admin session
        const storedAdmin = sessionStorage.getItem('admin_session');
        if (storedAdmin) {
            try {
                const adminData = JSON.parse(storedAdmin);
                // Check if session is still valid (8 hours)
                const sessionAge = Date.now() - new Date(adminData.loginTime).getTime();
                const maxAge = 8 * 60 * 60 * 1000; // 8 hours

                if (sessionAge < maxAge) {
                    setAdmin(adminData);
                } else {
                    sessionStorage.removeItem('admin_session');
                }
            } catch {
                sessionStorage.removeItem('admin_session');
            }
        }
        setLoading(false);
    }, []);

    const adminLogin = async (username: string, password: string): Promise<{ success: boolean; error: string | null }> => {
        // Simple credential check
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const adminUser: AdminUser = {
                username,
                role: 'admin',
                loginTime: new Date().toISOString(),
            };
            setAdmin(adminUser);
            sessionStorage.setItem('admin_session', JSON.stringify(adminUser));
            return { success: true, error: null };
        }

        return { success: false, error: 'Invalid admin credentials' };
    };

    const adminLogout = () => {
        setAdmin(null);
        sessionStorage.removeItem('admin_session');
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                isAdminAuthenticated: !!admin,
                loading,
                adminLogin,
                adminLogout,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthContext;
