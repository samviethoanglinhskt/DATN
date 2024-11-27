import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "src/config/axiosInstance";
import { User } from "src/types/user";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>; // Hàm cập nhật thông tin
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
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
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axiosInstance.get("/api/show-user", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setUser(response.data);

        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Hàm update thông tin người dùng
  const updateUser = async (updatedData: Partial<User>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Người dùng chưa đăng nhập.");
      }

      const response = await axiosInstance.put("/api/update-user", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Cập nhật user trong context sau khi thành công
      setUser(response.data);
      console.log("Cập nhật thông tin người dùng thành công:", response.data);
    } catch (error) {
      console.error("Cập nhật thông tin người dùng thất bại:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
