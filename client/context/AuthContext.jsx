import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [token, setToken] = useState(localStorage.getItem("token"));
   const [authUser, setAuthUser] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [socket, setSocket] = useState(null);

   // connect socket (keeps socket logic isolated)
   const connectSocket = (userData) => {
      if (!userData) return;
      // avoid reconnecting if already connected
      if (socket && socket.connected) return;

      const newSocket = io(backendUrl, { query: { userId: userData._id } });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
         setOnlineUsers(userIds);
      });
   };

   // check if user is authenticated and if so, set the user data and connect the socket
   const checkAuth = async () => {
      try {
         const { data } = await axios.get("/api/auth/check");
         if (data?.success) {
            setAuthUser(data.user);
            connectSocket(data.user);
         }
      } catch (error) {
         // don't spam the user with errors here; useful to inspect terminal if backend isn't running
         // toast.error(error.message);
      }
   };

   // Login function
   const login = async (state, credentials) => {
      try {
         const { data } = await axios.post(`/api/auth/${state}`, credentials);
         if (data.success) {
            setAuthUser(data.userData || data.user);
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            connectSocket(data.user || data.userData);
            toast.success(data.message);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.message);
      }
   };

   // Logout function
   const logout = async () => {
      try {
         localStorage.removeItem("token");
         setAuthUser(null);
         setToken(null);
         setOnlineUsers([]);
         delete axios.defaults.headers.common["token"];
         if (socket) {
            socket.disconnect();
            setSocket(null);
         }
         toast.success("Logged out successfully");
      } catch (error) {
         toast.error(error.message);
      }
   };

   // update profile function
   const updateProfile = async (body) => {
      try {
         const { data } = await axios.put("/api/auth/update-profile", body);
         if (data.success) {
            setAuthUser(data.user);
            toast.success("Profile updated successfully");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.message);
      }
   };

   useEffect(() => {
      if (token) axios.defaults.headers.common["token"] = token;
      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const value = {
      axios,
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
