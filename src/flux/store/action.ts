import { LocationData } from "../../types"
import { CartAction, CartActionType, CartInfo } from "./types"

export const fetchCartData = (cartInfo: CartInfo): CartAction =>{
    return {
        type: CartActionType.FETCH_DATA,
        payload: {
            targetCartInfo: cartInfo
        }
    }
}
export const changeCart = (cartInfo: CartInfo): CartAction => {
    return {
        type: CartActionType.UPDATE_CART,
        payload: {
            targetCartInfo: cartInfo
        }
    }
}

export const changeLocation = (locationInfo: LocationData): CartAction => {
    return {
        type: CartActionType.CHANGE_LOCATION,
        payload: {
            targetLocationInfo: locationInfo
        }
    }
}
