import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    createdAt?: string;
}

// Sign up with email and password
export const signUp = async (
    email: string,
    password: string,
    name?: string
): Promise<{ user: AuthUser | null; error: string | null }> => {
    if (!isSupabaseConfigured()) {
        // Demo mode - simulate successful registration
        const mockUser: AuthUser = {
            id: 'demo-user-' + Date.now(),
            email,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { user: mockUser, error: null };
    }

    try {
        const { data, error } = await supabase!.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email || email,
                    name: data.user.user_metadata?.name || name,
                    createdAt: data.user.created_at,
                },
                error: null,
            };
        }

        return { user: null, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
        return { user: null, error: err.message || 'An unexpected error occurred' };
    }
};

// Sign in with email and password
export const signIn = async (
    email: string,
    password: string
): Promise<{ user: AuthUser | null; error: string | null }> => {
    if (!isSupabaseConfigured()) {
        // Demo mode - simulate login
        const mockUser: AuthUser = {
            id: 'demo-user-' + Date.now(),
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return { user: mockUser, error: null };
    }

    try {
        const { data, error } = await supabase!.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email || email,
                    name: data.user.user_metadata?.name,
                    avatarUrl: data.user.user_metadata?.avatar_url,
                    createdAt: data.user.created_at,
                },
                error: null,
            };
        }

        return { user: null, error: 'Login failed. Please try again.' };
    } catch (err: any) {
        return { user: null, error: err.message || 'An unexpected error occurred' };
    }
};

// Sign out
export const signOut = async (): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured()) {
        localStorage.removeItem('demo_user');
        return { error: null };
    }

    try {
        const { error } = await supabase!.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err: any) {
        return { error: err.message || 'An unexpected error occurred' };
    }
};

// Get current session
export const getSession = async (): Promise<{ session: Session | null; user: AuthUser | null }> => {
    if (!isSupabaseConfigured()) {
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
            return { session: null, user: JSON.parse(storedUser) };
        }
        return { session: null, user: null };
    }

    try {
        const { data: { session } } = await supabase!.auth.getSession();

        if (session?.user) {
            return {
                session,
                user: {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name,
                    avatarUrl: session.user.user_metadata?.avatar_url,
                    createdAt: session.user.created_at,
                },
            };
        }
        return { session: null, user: null };
    } catch (err) {
        return { session: null, user: null };
    }
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
    if (!isSupabaseConfigured()) {
        // For demo mode, just call with stored user
        const storedUser = localStorage.getItem('demo_user');
        callback(storedUser ? JSON.parse(storedUser) : null);
        return { unsubscribe: () => { } };
    }

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            callback({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name,
                avatarUrl: session.user.user_metadata?.avatar_url,
                createdAt: session.user.created_at,
            });
        } else {
            callback(null);
        }
    });

    return { unsubscribe: () => subscription.unsubscribe() };
};

// Update user profile
export const updateProfile = async (
    updates: { name?: string; avatarUrl?: string }
): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured()) {
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.name = updates.name || user.name;
            user.avatarUrl = updates.avatarUrl || user.avatarUrl;
            localStorage.setItem('demo_user', JSON.stringify(user));
        }
        return { error: null };
    }

    try {
        const { error } = await supabase!.auth.updateUser({
            data: {
                name: updates.name,
                avatar_url: updates.avatarUrl,
            },
        });

        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err: any) {
        return { error: err.message || 'An unexpected error occurred' };
    }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured()) {
        return { error: null }; // Simulate success in demo mode
    }

    try {
        const { error } = await supabase!.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });

        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err: any) {
        return { error: err.message || 'An unexpected error occurred' };
    }
};
