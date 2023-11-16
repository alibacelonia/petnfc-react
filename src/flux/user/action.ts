import { UserAction, UserActionType, UserInfo } from "./types"

export const fetchUserData = (userInfo: UserInfo): UserAction =>{
    return {
        type: UserActionType.FETCH_DATA,
        payload: {
            targetUserInfo: userInfo
        }
    }
}
export const changeUser = (userInfo: UserInfo): UserAction => {
    return {
        type: UserActionType.UPDATE_PET,
        payload: {
            targetUserInfo: userInfo
        }
    }
}