import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { FeeInfo, LocationData } from "../../../types";
import moment from "moment";
import { ProductInfo } from "../../../flux/product/types";
import { CartInfo, CartItem } from "../../../flux/store/types";
import axios from "axios";
import { CartInfoContext } from "../../../flux/store/store";
import { changeCart, changeLocation } from "../../../flux/store/action";

const products: ProductInfo[] = [
  {
    productId: "1",
    productName: "Pet NFC Tag",
    description:
      "This is a sample product description. Provide details about the product and its features.",
    price: 10.0,
    currency: "AUD",
    discount: {
      type: "percentage",
      value: 40,
      expirationDate: "2024-2-31",
    },

    freebies: ["Free shipping", "Bonus accessory"],
    category: "Electronics",
    manufacturer: "Example Manufacturer",
    imageUrl: "/assets/petqr.png",
    enabled: true,
  },
  {
    productId: "2",
    productName: "Pet NFC Tag",
    description:
      "This is a sample product description. Provide details about the product and its features.",
    price: 5.0,
    currency: "AUD",
    discount: {
      type: "fixed",
      value: 2,
      expirationDate: "2024-2-31",
    },

    freebies: ["Free shipping", "Bonus accessory"],
    category: "Electronics",
    manufacturer: "Example Manufacturer",
    imageUrl: "/assets/petqr.png",
    enabled: true,
  },
];

const checkIfAnyChecked = (items: any[]) => items.some((item: any) => item);
const getDiscountValue = (product: ProductInfo) => {
  const dateDiff = moment(product.discount.expirationDate).diff(
    moment(),
    "days"
  );
  const discount =
    dateDiff < 0
      ? 0
      : product.discount.type === "fixed"
      ? product.discount.value
      : product.price * (product.discount.value / 100);
  return discount;
};

const calculateTotalPrice = (item: CartItem): number => {
  return item.price * item.quantity - item.discount;
};

// Function to calculate the total price for all products
const calculateTotalPriceForAllProducts = (
  items: CartItem[],
  checkedItems: boolean[]
): number => {
  return items.reduce((total, product, index) => {
    // Only calculate the total if the item is checked (checkedItems[index] is true)
    if (checkedItems[index]) {
      return total + calculateTotalPrice(product);
    }
    return total;
  }, 0);
};

export const useLogic = () => {
  const { cartDispatch } = React.useContext(CartInfoContext);

  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    products.map((_) => false)
  );
  const [fees, setFees] = React.useState<FeeInfo[]>([]);
  const [locationData, setLocationData] = useState<LocationData>({
    country_code: "",
    country_name: "",
    city: null,
    postal: null,
    latitude: 0,
    longitude: 0,
    IPv4: "",
    state: null,
  });
  const [virtualCart, setVirtualCart] = useState<CartItem[]>(
    products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      quantity: 1,
      price: product.price,
      discount: getDiscountValue(product),
    }))
  );

  const applyFees = (totalPrice: number, fees: FeeInfo[]): number => {
    // If the total price is initially 0, return 0
    if (totalPrice === 0 && !checkIfAnyChecked(checkedItems)) {
      return 0;
    }

    return fees.reduce((total, fee) => {
      if (fee.operation === "ADD") {
        return total + fee.amount;
      } else if (fee.operation === "SUBTRACT") {
        return total - fee.amount;
      }
      return total;
    }, totalPrice);
  };

  const getFees = async () => {
    await axiosPrivate
      .get(`/fees/filtered`)
      .then((response) => {
        setFees(response.data.fees);
      })
      .catch((error) => {
        // console.log(error.data);
      });
  };

  const getCurrentLocation = async () => {
    await axios
      .get(`https://geolocation-db.com/json/`)
      .then((response) => {
        cartDispatch(changeLocation(response.data));
      })
      .catch((error) => {
        // console.log(error.data);
      });
  };

  // get fees
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getFees(), getCurrentLocation()]);
    };
    fetchData();
  }, []);

  // cart
  useEffect(() => {
    // console.info("checkedItems: ", checkedItems);
    const productPrice = calculateTotalPriceForAllProducts(
      virtualCart,
      checkedItems
    );
    setGrandTotal(applyFees(productPrice, fees));

    const cartInfo: CartInfo = {items: virtualCart.filter((obj, i) => checkedItems[i]), grandTotal: Number(applyFees(productPrice, fees).toFixed(2)), addtionalFees: fees};

    cartDispatch(changeCart(cartInfo));
  }, [checkedItems, virtualCart]);

  useEffect(() => {
    // sessionStorage.removeItem('derivedKey');
  }, []);

  return {
    locationData,
    fees,
    setFees,
    products,
    virtualCart,
    setVirtualCart,
    getDiscountValue,
    calculateTotalPriceForAllProducts,
    checkedItems,
    setCheckedItems,
    grandTotal,
    setGrandTotal,
    totalProductPrice,
    setTotalProductPrice,
    checkIfAnyChecked,
  };
};
