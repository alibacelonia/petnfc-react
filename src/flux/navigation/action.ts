import { PetInfo } from "../pets/types"
import { UserInfo } from "../user/types"
import { PageAction, PageActionType } from "./types"

export const changePage = (page: string, data: PetInfo | UserInfo = {} as PetInfo | UserInfo ): PageAction => {
    return {
        type: PageActionType.CHANGE_PAGE,
        payload: {
            targetPage: page,
            pageData: data as PetInfo | undefined
        }
    }
}