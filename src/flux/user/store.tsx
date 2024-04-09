import React from "react";
import { UserContextType } from "./types";
import { reducer } from "./reducer";

export const UserInfoContext = React.createContext<UserContextType>({
    userState:{
        userInfo: {
            firstname: "",
            lastname: "",
            email: "",
            photo: "",
            id: "",
            street_address: "",
            postal_code: "",
            city_code: "",
            city: "",
            state_code: "",
            state: "",
            country_code: "",
            country: "",
            phone_number: "",
            secondary_contact: "",
            secondary_contact_number: "",
            verified: true,
            verification_code: "",
            role: "user",
            created_at: "",
            updated_at: "",
            otp: "",
            otp_secret: "",
            otp_created_at: "",
            status: "active",
            settings: null
          },
        history: []
    },
    userDispatch: () => void 0,
})

export const UserProvider = ({children} : {children?: React.ReactNode}) => {
    const [userState, userDispatch] = React.useReducer(reducer, {
        userInfo: {
            firstname: "",
            lastname: "",
            email: "",
            photo: "",
            id: "",
            street_address: "",
            postal_code: "",
            city_code: "",
            city: "",
            state_code: "",
            state: "",
            country_code: "",
            country: "",
            phone_number: "",
            secondary_contact: "",
            secondary_contact_number: "",
            verified: true,
            verification_code: "",
            role: "user",
            created_at: "",
            updated_at: "",
            otp: "",
            otp_secret: "",
            otp_created_at: "",
            status: "active",
            settings: null
          },
        history: []
    })

    return(
        <UserInfoContext.Provider value={{userState, userDispatch}}>
            {children}
        </UserInfoContext.Provider>
    )
}