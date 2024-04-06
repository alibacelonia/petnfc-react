import { FeeInfo, LocationData } from "../../types";

export type Discount = {
  type: string;
  value: number;
  expirationDate: string;
};

export type CartItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
};

export type CartInfo = {
  items: CartItem[];
  addtionalFees: FeeInfo[],
  grandTotal: number;
};

export type CartInfoContextState = {
  locationInfo: LocationData
  cartInfo: CartInfo;
  history: CartAction[];
};

export enum CartActionType {
  FETCH_DATA = "FETCH_DATA",
  UPDATE_CART = "UPDATE_CART",
  CHANGE_LOCATION = "CHANGE_LOCATION"
}

export type CartActionPayload = {
  targetCartInfo?: CartInfo;
  targetLocationInfo?: LocationData;
};

export type CartAction = {
  type: CartActionType;
  payload?: CartActionPayload;
};

export type CartContextType = {
  cartState: CartInfoContextState;
  cartDispatch: React.Dispatch<CartAction>;
};
