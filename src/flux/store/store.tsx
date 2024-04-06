import React from "react";
import { CartContextType } from "./types";
import { reducer } from "./reducer";

export const CartInfoContext = React.createContext<CartContextType>({
  cartState: {
    locationInfo: {
      country_code: "",
      country_name: "",
      city: null,
      postal: null,
      latitude: 0,
      longitude: 0,
      IPv4: "",
      state: null,
    },
    cartInfo: {
      items: [],
      addtionalFees:[],
      grandTotal: 0,
    },
    history: [],
  },
  cartDispatch: () => void 0,
});

export const CartProvider = ({ children }: { children?: React.ReactNode }) => {
  const [cartState, cartDispatch] = React.useReducer(reducer, {
    locationInfo: {
        country_code: "",
        country_name: "",
        city: null,
        postal: null,
        latitude: 0,
        longitude: 0,
        IPv4: "",
        state: null,
    },
    cartInfo: {
      items: [],
      addtionalFees: [],
      grandTotal: 0,
    },
    history: [],
  });

  return (
    <CartInfoContext.Provider value={{ cartState, cartDispatch }}>
      {children}
    </CartInfoContext.Provider>
  );
};
