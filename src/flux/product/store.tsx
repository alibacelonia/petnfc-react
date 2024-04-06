import React from "react";
import { ProductContextType } from "./types";
import { reducer } from "./reducer";

export const ProductInfoContext = React.createContext<ProductContextType>({
    productState:{
        productInfos: [],
        history: []
    },
    productDispatch: () => void 0,
})

export const ProductProvider = ({children} : {children?: React.ReactNode}) => {
    const [productState, productDispatch] = React.useReducer(reducer, {
        productInfos: [],
        history: []
    })

    return(
        <ProductInfoContext.Provider value={{productState, productDispatch}}>
            {children}
        </ProductInfoContext.Provider>
    )
}