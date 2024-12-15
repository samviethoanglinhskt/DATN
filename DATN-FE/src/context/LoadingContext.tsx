import React, { createContext, useState, useContext, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface LoadingContextType {
    loading: boolean; // Trạng thái loading
    setLoading: (value: boolean) => void; // Hàm để cập nhật trạng thái loading
}

// Tạo context với giá trị mặc định ban đầu
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Định nghĩa kiểu dữ liệu cho props của Provider
interface LoadingProviderProps {
    children: ReactNode; // Các component con nằm bên trong Provider
}

// Tạo LoadingProvider để bọc toàn ứng dụng
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook để sử dụng LoadingContext
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
