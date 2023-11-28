import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import LoadingComponent from "./Loading";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                localStorage.clear();
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
    
        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
    
        return () => {isMounted = false};
    }, [])
    

    useEffect(() => {
        // console.log(`isLoading: ${isLoading}`)
        // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])
    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <LoadingComponent />
                    : auth?.accessToken ? <Navigate to="/home" state={{ from: location }} replace /> : <Outlet />
            }
        </>
    )
}

export default PersistLogin