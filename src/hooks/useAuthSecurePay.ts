import { useContext, useDebugValue } from "react";
import SecurePayAuthContext from "../context/SecurePayAuthProvider"; // Assuming you have an AuthContextProps type

const useAuth = () => {
    const { auth } = useContext(SecurePayAuthContext);
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out");
    return useContext(SecurePayAuthContext);
}

export default useAuth;
