import React from "react";
import { PageContextType } from "./types";
import { reducer } from "./reducer";
import { PetInfo } from "../pets/types";

    

let savedPage: string = localStorage.getItem("currentPage") || "home";
const savedPageDataString = localStorage.getItem("pageData");
let savedPageData: PetInfo | null = savedPageDataString ? JSON.parse(savedPageDataString) : null;


export const PageInfoContext = React.createContext<PageContextType>({
    pageState:{
        selectedPage: savedPage,
        pageData: savedPageData
    },
    pageDispatch: () => void 0,
})

// export const PageProvider = ({children} : {children?: React.ReactNode}) => {
//     const [pageState, pageDispatch] = React.useReducer(reducer, {
//         selectedPage: "home",
//         pageData: undefined
//     })

//     return(
//         <PageInfoContext.Provider value={{pageState, pageDispatch}}>
//             {children}
//         </PageInfoContext.Provider>
//     )
// }

export const PageProvider = ({ children }: { children?: React.ReactNode }) => {

    const [pageState, pageDispatch] = React.useReducer(reducer, {
        selectedPage: savedPage,
        pageData: savedPageData
    });

    return (
        <PageInfoContext.Provider value={{ pageState, pageDispatch }}>
            {children}
        </PageInfoContext.Provider>
    );
};
