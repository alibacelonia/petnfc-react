import { ProductInfoContextState, ProductAction, ProductActionType } from "./types"

export const reducer = (
    state: ProductInfoContextState,
    action: ProductAction
): ProductInfoContextState => {
    switch (action.type) {
        case ProductActionType.FETCH_DATA:
            return action.payload?.targetProductInfos ? {
                ...state,
                productInfos: [...action.payload.targetProductInfos],
                history: [...state.history, action],
            } : state
        
        case ProductActionType.ADD_PRODUCT:
            return action.payload?.targetProductInfo ? {
                ...state,
                productInfos: [...state.productInfos, action.payload.targetProductInfo],
                history: [...state.history, action],
            }: state

        case ProductActionType.UPDATE_PRODUCT:
            const updatedProduct = action.payload?.targetProductInfo;

            if (!updatedProduct){
                return state
            }

            const productInfos = state.productInfos.map(productInfo => productInfo.productId === updatedProduct.productId ? updatedProduct : productInfo);

            return {
                ...state,
                productInfos: productInfos,
                history: [...state.history, action],
            }

        // Add a default case to handle other action types
        default:
            return state;
    }
}
