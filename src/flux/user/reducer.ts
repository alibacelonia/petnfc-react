import { UserInfoContextState, UserAction, UserActionType } from "./types"

export const reducer = (
    state: UserInfoContextState,
    action: UserAction
): UserInfoContextState => {
    switch (action.type) {
        case UserActionType.FETCH_DATA:
            return action.payload?.targetUserInfo ? {
                ...state,
                userInfo: action.payload.targetUserInfo,
            } : state

        case UserActionType.UPDATE_PET:

            return action.payload?.targetUserInfo ? {
                ...state,
                userInfo: action.payload.targetUserInfo,
            } : state

        // Add a default case to handle other action types
        default:
            return state;
    }
}
