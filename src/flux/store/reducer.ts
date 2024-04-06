import { CartInfoContextState, CartAction, CartActionType } from "./types"

export const reducer = (
    state: CartInfoContextState,
    action: CartAction
): CartInfoContextState => {
    switch (action.type) {
        case CartActionType.FETCH_DATA:
            return action.payload?.targetCartInfo ? {
                ...state,
                locationInfo: state.locationInfo,
                cartInfo: action.payload.targetCartInfo,
                history: [...state.history, action],
            } : state

        case CartActionType.UPDATE_CART:

            return action.payload?.targetCartInfo ? {
                ...state,
                locationInfo: state.locationInfo,
                cartInfo: action.payload.targetCartInfo,
                history: [...state.history, action],
            } : state


        case CartActionType.CHANGE_LOCATION:

            return action.payload?.targetLocationInfo ? {
                ...state,
                locationInfo: action.payload?.targetLocationInfo,
                cartInfo: state.cartInfo,
                history: [...state.history, action],
            } : state

        // Add a default case to handle other action types
        default:
            return state;
    }
}
