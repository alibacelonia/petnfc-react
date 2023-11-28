import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
    auth: any;
    setAuth: React.Dispatch<React.SetStateAction<any>>;
    persist: boolean;
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}
  
const AuthContext = createContext<AuthContextType>({
  auth: {}, // Replace 'any' with the actual type of auth
  setAuth: () => {}, // Replace 'any' with the actual type of auth
  persist: true,
  setPersist: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<any>({}); // Replace 'any' with the actual type of auth
  // const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem("persist") || "false"));
  const [persist, setPersist] = useState<boolean>(true);

  return (
    <>
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
        {children}
        </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
