import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setUser, UserSlicePath } from "@/redux/slice/user.slice";
import { toast } from "react-toastify";
import { axiosClient } from "@/utils/axiosClient";
import LoaderComponent from "@/components/ui/LoaderComponent";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  fetchUserProfile: () => {},
  logoutUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const user = useSelector(UserSlicePath);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem("token") || "";

        if (!token) return 
          
        const response = await axiosClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        dispatch(setUser(data));
    } catch (e) {
        toast.error(e.response?.data?.detail || e.message);
    } finally{
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    toast.success("Đăng xuất thành công");
    navigate("/");
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, fetchUserProfile, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
