import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingComponent from "../../../../Components/Loading";
import { decrypt } from "../../../../../utils";
import { CartInfoContext } from "../../../../../flux/store/store";
import React from "react";
import { changeCart, changeLocation } from "../../../../../flux/store/action";

const PaymentLoader = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const stateParam = searchParams.get('state');

    const {cartState, cartDispatch} = React.useContext(CartInfoContext);
    

    useEffect(() => {
        if(stateParam){
            try{
                const decryptedText = decrypt(stateParam)
                const decrypted = JSON.parse(decryptedText)
                cartDispatch(changeLocation(decrypted.locationInfo))
                cartDispatch(changeCart(decrypted.cartInfo))
                setIsLoading(false);
            }
            catch(err){
                // sessionStorage.removeItem('derivedKey');
                setIsLoading(false);
                navigate("/order-petnfc-qr-tag", { replace: true })
            }
        }
        else{
            // sessionStorage.removeItem('derivedKey');
            setIsLoading(false);
            navigate("/order-petnfc-qr-tag", { replace: true })
        }
    }, [])

    return (
        <>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default React.memo(PaymentLoader);
