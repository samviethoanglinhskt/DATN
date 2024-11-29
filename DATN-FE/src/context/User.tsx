import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "src/config/axiosInstance";
import { Address, User } from "src/types/user";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  addresses: Address[];
  addAddress: (newAddressData: Partial<Address>) => Promise<void>;
  updateAddress: (id: number, updatedData: Partial<Address>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
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
  const [addresses, setAddresses] = useState<Address[]>([]);

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
          setAddresses(response.data.data.address || []);

        } else {
          setUser(null);
          setAddresses([]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setAddresses([]);
      }
    };
    fetchUser();
  }, []);
  console.log(user);

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

  const addAddress = async (newAddressData: Partial<Address>) => {
    try {
      const response = await axiosInstance.post("/api/address", newAddressData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setAddresses((prev) => [...prev, response.data.data]);
      } else {
        throw new Error("Thêm địa chỉ không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      throw error;
    }
  };

  const updateAddress = async (id: number, updatedData: Partial<Address>) => {
    try {
      const response = await axiosInstance.put(`/api/address/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setAddresses((prev) =>
          prev.map((address) =>
            address.id === id ? { ...address, ...updatedData } : address
          )
        );
      } else {
        throw new Error("Cập nhật địa chỉ không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      throw error;
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/address/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      await axiosInstance.put(
        `/api/address-default`,
        { id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Cập nhật lại danh sách địa chỉ trong state
      setAddresses((prev) =>
        prev
          .map((address) =>
            address.id === id
              ? { ...address, is_default: true }
              : { ...address, is_default: false }
          )
          .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
      );
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
    }}>
      {children}
    </UserContext.Provider>
  );
};
