import { PetInfo } from "../pets/types"
import { PageAction, PageActionType } from "./types"

export const changePage = (page: string, data: PetInfo = {} as PetInfo ): PageAction => {
    return {
        type: PageActionType.CHANGE_PAGE,
        payload: {
            targetPage: page,
            pageData: data
        }
    }
}