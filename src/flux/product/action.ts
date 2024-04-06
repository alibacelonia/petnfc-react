import { ProductAction, ProductActionType, ProductInfo } from "./types"

export const fetchProductData = (productInfos: ProductInfo[]): ProductAction =>{
    return {
        type: ProductActionType.FETCH_DATA,
        payload: {
            targetProductInfos: [...productInfos]
        }
    }
}

export const addProduct = (productInfo: ProductInfo): ProductAction => {
    return {
        type: ProductActionType.ADD_PRODUCT,
        payload: {
            targetProductInfo: productInfo
        }
    }
}
export const changeProduct = (productInfo: ProductInfo): ProductAction => {
    return {
        type: ProductActionType.UPDATE_PRODUCT,
        payload: {
            targetProductInfo: productInfo
        }
    }
}