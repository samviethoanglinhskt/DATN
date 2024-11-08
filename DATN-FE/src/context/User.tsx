import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axiosInstance from 'src/config/axiosInstance';
import { User } from 'src/types/user';

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axiosInstance.get('/api/user', {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    });
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
