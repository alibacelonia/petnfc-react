import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingComponent from "../../Components/Loading";
import axios, { axiosPrivate } from "../../../api/axios";

type ContextType = { isSuccess: boolean };

export default function VerifyEmailLoader(){

    const navigate = useNavigate();
    const { id } = useParams<{ id: string | undefined }>();
  
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if(isLoading){
            if (id === undefined || id === null) {
                navigate('/pet/error/not-found', { replace: true });
            } else {
                axios.get(`/auth/verifyemail/${id}`).then((response) => {
                    console.log(response);
                    setIsSuccess(true);
                    setIsLoading(false);
                }).catch((e) => {
                    console.log(e);
                    setIsSuccess(false);
                    setIsLoading(false);
                });
            }
        }
        return () => { isMounted = false; };
    }, []); // empty dependency array
    

    return (
        <>
            {isLoading
                    ? <LoadingComponent />
                    : <Outlet context={{ isSuccess } satisfies ContextType} />
            }
        </>
    )
}

export function useIsSuccess() {
    return useOutletContext<ContextType>();
}