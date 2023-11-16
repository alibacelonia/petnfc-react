import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingComponent from "../../../Components/Loading";
import { axiosPrivate } from "../../../../api/axios";

const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    return uuidRegex.test(uuid);
  };
  

const PetDetailsLoader = () => {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string | undefined }>();
  
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (id === undefined || !isValidUUID(id)) {
            navigate('/pet/error/not-found', { replace: true });
        }
        else{
            axiosPrivate.get(`/pet/${id}/check`).then((response)=>{
                if(response.data.has_owner){
                    setIsLoading(false)
                }
                else{
                    navigate(`/pet/${id}/found`, { replace: true });
                    setIsLoading(false)
                }
            }).catch(() =>{
                navigate('/pet/error/not-found', { replace: true });
            });
        }
        return () => {isMounted = false};
    }, [])

    return (
        <>
            {isLoading
                    ? <LoadingComponent />
                    : <Outlet />
            }
        </>
    )
}

export default PetDetailsLoader