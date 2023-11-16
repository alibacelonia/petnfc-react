import React from "react";
import { PetContextType } from "./types";
import { reducer } from "./reducer";

export const PetInfoContext = React.createContext<PetContextType>({
    petState:{
        petInfos: [],
        history: []
    },
    petDispatch: () => void 0,
})

export const PetProvider = ({children} : {children?: React.ReactNode}) => {
    const [petState, petDispatch] = React.useReducer(reducer, {
        petInfos: [],
        history: []
    })

    return(
        <PetInfoContext.Provider value={{petState, petDispatch}}>
            {children}
        </PetInfoContext.Provider>
    )
}