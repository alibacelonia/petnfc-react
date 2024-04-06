import React, { createContext, useState, ReactNode } from "react";

interface SecurePayAuthContextType {
    auth: any;
    setSecurePayAuth: React.Dispatch<React.SetStateAction<any>>;
    persist: boolean;
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}
  
const SecurePayAuthContext = createContext<SecurePayAuthContextType>({
  auth: {}, // Replace 'any' with the actual type of auth
  setSecurePayAuth: () => {}, // Replace 'any' with the actual type of auth
  persist: true,
  setPersist: () => {},
});

interface SecurePayAuthProviderProps {
  children: ReactNode;
}

export const SecurePayAuthProvider: React.FC<SecurePayAuthProviderProps> = ({ children }) => {
  const [auth, setSecurePayAuth] = useState<any>({}); // Replace 'any' with the actual type of auth
  // const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem("persist") || "false"));
  const [persist, setPersist] = useState<boolean>(true);

  return (
    <>
        <SecurePayAuthContext.Provider value={{ auth, setSecurePayAuth, persist, setPersist }}>
        {children}
        </SecurePayAuthContext.Provider>
    </>
  );
};

export default SecurePayAuthContext;
