import { PetInfo } from "../pets/types";

export type PageInfoContextState = {
    selectedPage: string
    pageData: any,
    history: PageAction[];
}

export enum PageActionType {
    CHANGE_PAGE = "CHANGE_PAGE"
}

export type PageActionPayload = {
    targetPage?: string;
    pageData?: PetInfo
}

export type PageAction = {
    type: PageActionType
    payload?: PageActionPayload
}

export type PageContextType = {
    pageState: PageInfoContextState
    pageDispatch: React.Dispatch<PageAction>
}