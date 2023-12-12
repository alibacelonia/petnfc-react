import { PageInfoContextState, PageAction, PageActionType } from "./types"

export const reducer = (
    state: PageInfoContextState,
    action: PageAction
): PageInfoContextState => {
    switch (action.type) {
        case PageActionType.CHANGE_PAGE:
            
            const page = action.payload?.targetPage

            if (!page){
                return state
            }


            if(page!= "home_register_pet"){
                localStorage.removeItem("linkedID");
            }

            return {
                ...state,
                selectedPage: page,
                pageData:  action.payload?.pageData,
                history: [...state.history, action],
            }
    }
}