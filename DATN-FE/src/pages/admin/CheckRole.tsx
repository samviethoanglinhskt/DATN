import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "src/context/User";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRoute?: boolean; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminRoute }) => {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (user?.data?.user) {
      setLoading(false);
    }
  }, [user]); 

  // Nếu đang trong trạng thái loading, hiển thị loading spinner hoặc một cái gì đó
  if (loading) {
    return <div>Loading...</div>;
  }

  // Kiểm tra xem người dùng có login hay không
  if (!user?.data?.user) {
    return <Navigate to="/" />; // Nếu không có user, chuyển hướng về trang chính
  }

  const userRole = user.data.user.tb_role_id;

  // Nếu không phải admin (tb_role_id !== 1) và không phải adminnt (tb_role_id !== 3), không cho vào
  if (!(userRole === 1 || userRole === 3)) {
    return <Navigate to="/" />; // Nếu không phải admin hoặc adminnt, chuyển hướng về trang chính
  }

  // Kiểm tra nếu là route admin và user có tb_role_id !== 1 (Không phải admin)
  if (adminRoute && userRole !== 1) {
    return <Navigate to="/" />; // Nếu là route admin nhưng user không phải admin, chuyển hướng về trang chính
  }

  // Kiểm tra nếu là route admin mà user có tb_role_id === 3 (adminnt), thì chuyển hướng về trang adminnt
  if (userRole === 3 && adminRoute) {
    return <Navigate to="/adminnt" />; // Chuyển hướng người dùng có tb_role_id === 3 sang trang adminnt
  }

  return children; 
};

export default ProtectedRoute;
