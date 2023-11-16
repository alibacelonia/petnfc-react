import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider"; // Assuming you have an AuthContextProps type

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out");
    return useContext(AuthContext);
}

export default useAuth;
