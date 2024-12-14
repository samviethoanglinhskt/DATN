import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axiosInstance from 'src/config/axiosInstance';
import { Favorite, FavoriteContextProps } from 'src/types/favorite';



const FavoriteContext = createContext<FavoriteContextProps | undefined>(undefined);

interface FavoriteProviderProps {
    children: ReactNode;
}

export const FavoriteProvider = ({ children }: FavoriteProviderProps) => {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalFavorites, setTotalFavorites] = useState<number>(0);

    // Lấy danh sách yêu thích từ backend
    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/api/favorites');
            setFavorites(response.data);
            setTotalFavorites(response.data.length);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách yêu thích.');
        } finally {
            setLoading(false);
        }
    };

    // Thêm sản phẩm vào danh sách yêu thích
    const addFavorite = async (productId: number) => {
        try {
            const response = await axiosInstance.post('/api/favorites', { tb_product_id: productId });
            setFavorites((prev) => {
                const updatedFavorites = [...prev, response.data.favorite];
                setTotalFavorites(updatedFavorites.length);
                return updatedFavorites;
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể thêm sản phẩm vào danh sách yêu thích.');
        }
    };

    // Xóa sản phẩm khỏi danh sách yêu thích
    const removeFavorite = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/favorites/${id}`);
            setFavorites((prev) => {
                const updatedFavorites = prev.filter((fav) => fav.id !== id);
                setTotalFavorites(updatedFavorites.length);
                return updatedFavorites;
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích.');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                loading,
                error,
                totalFavorites,
                addFavorite,
                removeFavorite,
                fetchFavorites,
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = (): FavoriteContextProps => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider');
    }
    return context;
};
