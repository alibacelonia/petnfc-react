import axios from "axios";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LocationData } from "../../../../../types";
import { CartInfoContext } from "../../../../../flux/store/store";
import { ProductInfo } from "../../../../../flux/product/types";
import { CartAction, CartInfo } from "../../../../../flux/store/types";
import { axiosPrivate } from "../../../../../api/axios";
import { eventManager } from "react-toastify/dist/core";
import { useDisclosure } from "@chakra-ui/react";


interface AlertObject {
  type: "info" | "warning" | "success" | "error" | "loading" | undefined;
  title: string;
  message: string;
}

type SecurePayUIType = {
  tokenise: () => void; // Adjust this type based on the actual type of tokenise
  // Add other properties and methods if needed
};

interface CardTypeChangeEvent {
  cardType: string;
}

interface BINChangeEvent {
  cardBIN: string;
}

interface FormValidityChangeEvent {
  valid: boolean;
}

interface TokeniseSuccessEvent {
  tokenisedCard: any; // You might want to replace 'any' with the actual type of tokenisedCard
}

interface TokeniseErrorEvent {
  errors: any[]; // You might want to replace 'any[]' with the actual type of errors
}

interface SecurePayUIProps {
  clientId: string;
  merchantCode: string;
}

export type Inputs = {
  email: string;
  billing_address1: string;
  billing_address2: string;
  state: string;
  postal_code: string;
  [key: string]: string;
};

function serializeFormData(data: Inputs): string {
  return Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join("&");
}

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
      value: 2.49,
      expirationDate: "2024-1-31",
    },

    freebies: ["Free shipping", "Bonus accessory"],
    category: "Electronics",
    manufacturer: "Example Manufacturer",
    imageUrl: "/assets/petqr.png",
    enabled: true,
  },
];

export const useLogic = () => {
  const MERCHANT_CODE = process.env.REACT_APP_MERCHANT_CODE;
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    // Set your API endpoint
  const apiUrl = process.env.REACT_APP_API_URL;
  const { cartState, cartDispatch } = React.useContext(CartInfoContext);

  const cardPaymentClientRef = useRef<SecurePayUIType | null>(null);
  const securepayUiLoadedRef = useRef(false);
  const [securePayAccessToken, setSecurePayAccessToken] = useState("");
  const [loadedSecurePay, setLoadedSecurePay] = useState(false);

  const [isTokenized, setIsTokenized] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [tokenizedCard, setTokenizedCard] =
    useState<any | null>(null);

  const cartInfo = cartState.cartInfo;
  const locationInfo = cartState.locationInfo;

  const [formdata, setFormData] = useState<Inputs>({
    email: "",
    billing_address1: "",
    billing_address2: "",
    state: "",
    postal_code: "",
  });

  useEffect(() => {
    console.info("Cart State: ", cartState);
  }, []);

  const [locationData, setLocationData] = useState(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<Inputs>();


  const {
    isOpen: isVisibleAlert,
    onClose: onCloseAlert,
    onOpen: onOpenAlert,
  } = useDisclosure({ defaultIsOpen: false })

  const { 
    isOpen: isOpenModalProcessing,
    onClose: onCloseModalProcessing,
    onOpen: onOpenModalProcessing,
   } = useDisclosure({ defaultIsOpen: false })


  const [alert, setAlert] = useState<AlertObject>({type: undefined, title: "", message: ""});

  // FUNCTION FOR GETTING THE ACCESS TOKEN FOR SECURE API IN OUR BACKEND
  const getAccessToken = async () => {

    if (!apiUrl) {
      console.error("REACT_APP_API_URL is not set in the environment.");
      return null;
    }

    try {
      // Make the Axios POST request
      const response = await axios.get(
        `${apiUrl}/auth/securepay/get-access-token`
      );

      // Handle the response here
      console.log(response);
      return response;
    } catch (error) {
      // Handle errors here
      console.error("Error:", error);
    }
    return;
  };

  // USE EFFECT FOR GETTING THE ACCESS TOKEN FOR SECURE API IN OUR BACKEND
  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessToken();
      setSecurePayAccessToken(token?.data?.access_token);
    };
    getToken();
  }, []);

  // USE EFFECT FOR MONITORING `isTokenized` VARIABLE
  useEffect(() => {
    console.info(
      `USE_EFFECT: isTokenised: ${isTokenized}, isProcessingPayment: ${isProcessingPayment}`
    );
    if (isTokenized) {
      if (tokenizedCard != null) {
        makePaymentRequest(tokenizedCard);
      }
    }
  }, [isTokenized]);



  // USE EFFECT FOR LOADING SECURE API SCRIPT
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://payments-stest.npe.auspost.zone/v3/ui/client/securepay-ui.min.js";
    script.id = "securepay-ui-js";
    // script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      cardPaymentClientRef.current = new (window as any).securePayUI.init({
        containerId: "securepay-ui-container",
        scriptId: "securepay-ui-js",
        clientId: CLIENT_ID,
        merchantCode: MERCHANT_CODE,
        card: {
          allowedCardTypes: ["visa", "mastercard"],
          showCardIcons: true,
          onCardTypeChange: (event: CardTypeChangeEvent) => {
            // card type has changed
            console.info(event);
          },
          onBINChange: (event: BINChangeEvent) => {
            // card BIN has changed
            console.info(event);
          },
          onFormValidityChange: (event: FormValidityChangeEvent) => {
            // form validity has changed
            console.info(event);
          },
          onTokeniseSuccess: (event: TokeniseSuccessEvent) => {
            // card was successfully tokenized or saved card was successfully retrieved
            setTokenizedCard(event);
            setIsTokenized(true);
          },
          onTokeniseError: (event: TokeniseErrorEvent) => {
            // tokenization failed
            setIsTokenized(false);
            console.error(event);
          },
        },
        style: {
          label: {
            font: {
              family: "Arial, Helvetica, sans-serif",
              size: "14px",
              color: "#374151",
              weight: 100,
            },
          },
          input: {
            font: {
              family: "Arial, Helvetica, sans-serif",
              size: "14px",
              color: "#374151",
              weight: 100,
            },
          },
        },
        onLoadComplete: () => {
          setLoadedSecurePay(true);
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // USE EFFECT MONITORING FOR ALERT
  useEffect(() => {
    if(alert.type === 'error') {
      onOpenAlert();
    }
  }, [alert]);

  const closeAlert = () => {
    setAlert({type: undefined, title: '', message: ''})
    onCloseAlert();
  }

  const makePaymentRequest = async (event: any) => {
    console.log("makePaymentRequest event: ", event);

    if (isTokenized && !isProcessingPayment) {
      setIsProcessingPayment(true);
      onOpenModalProcessing();
      axios.defaults.headers.common['Authorization'] = `Bearer ${securePayAccessToken}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      await axios.post(`${apiUrl}/auth/securepay/make-payment`, {
          "amount": cartInfo.grandTotal * 100,
          "merchantCode": MERCHANT_CODE,
          "token": event.token,
          "ip": locationInfo.IPv4 || "127.0.0.1"
      }).then((response)=>{
        console.info("Axios response: ", response);
        const responseData = response.data;

        if(responseData.hasOwnProperty('errors')){
          setAlert({type: 'error', title: responseData.errors.code.split('_').join(' '), message: responseData.errors.detail});
        }
        else{
          if(responseData.details.status === 'paid'){

          }
          else if(responseData.details.status === 'failed'){
            setAlert({type: 'error', title: responseData.details.errorCode.split('_').join(' '), message: responseData.details.gatewayResponseMessage})
          }
        }
          onCloseModalProcessing();

        }).catch((error)=>{
          console.error(error);
          onCloseModalProcessing();
        });
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    const { email, billing_address1, billing_address2, state, postal_code } =
      inputs;

    setIsTokenized(false);
    setIsProcessingPayment(false);
    const serializedData = serializeFormData(formdata);
    cardPaymentClientRef?.current?.tokenise();
  };

  return {
    loadedSecurePay,
    control,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    formdata,
    setFormData,
    onChangeInput,
    serializeFormData,
    products,
    cartInfo,
    locationInfo,
    isVisibleAlert,
    onCloseAlert,
    onOpenAlert,
    alert,
    setAlert,
    closeAlert,
    isOpenModalProcessing,
    onCloseModalProcessing
  };
};
