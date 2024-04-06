export type ProductInfo =  {
    productId: string;
    productName: string;
    description: string;
    price: number;
    currency: string;
    discount: {
      type: string;
      value: number;
      expirationDate: string;
    };
    freebies: string[];
    category: string;
    manufacturer: string;
    imageUrl: string;
    enabled: boolean;
  }


export type ProductInfoContextState = {
    productInfos: ProductInfo[];
    history: ProductAction[];
}

export enum ProductActionType {
    FETCH_DATA = "FETCH_DATA",
    ADD_PRODUCT = "ADD_PRODUCT",
    UPDATE_PRODUCT = "UPDATE_PRODUCT"
}

export type ProductActionPayload = {
    targetProductInfo?: ProductInfo;
    targetProductInfos?: ProductInfo[]
}

export type ProductAction = {
    type: ProductActionType
    payload?: ProductActionPayload
}

export type ProductContextType = {
    productState: ProductInfoContextState
    productDispatch: React.Dispatch<ProductAction>
}