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

export const loadScript = async (makePaymentRequest: any, setIsProcessingPayment: any, setLoadedSecurePay: any) => {
    if (!(window as any).securePayUI) {
      const script = document.createElement("script");
      script.src = "https://payments-stest.npe.auspost.zone/v3/ui/client/securepay-ui.min.js";
      script.id = "securepay-ui-js";
      script.async = true;
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
            new (window as any).securePayUI.init({
                containerId: "securepay-ui-container",
                scriptId: "securepay-ui-js",
                clientId: "0oaxb9i8P9vQdXTsn3l5",
                merchantCode: "5AR0055",
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
                    makePaymentRequest(event)
                    
                  },
                  onTokeniseError: (event: TokeniseErrorEvent) => {
                    // tokenization failed
                    setIsProcessingPayment(false)
                    console.error(event);
                  },
                },
                style: {
                  label: {
                    font: {
                      family: "Poppins",
                      size: "14px",
                      color: "#374151",
                      weight: "100",
                    },
                  },
                  p: {
                    font: {
                      family: "Poppins, sans",
                      size: "10px",
                      color: "#374151 !important",
                      weight: 100,
                    },
                  },
                  input: {
                    font: {
                      family: "Poppins",
                      size: "14px",
                      color: "#374151",
                      weight: 100,
                    },
                  },
                },
                onLoadComplete: () => {
                  setLoadedSecurePay(true)
                },
              });
        };
        script.onerror = reject;
        document.body.appendChild(script);
      });
      (window as any).securePayUI = true;
    }
  };