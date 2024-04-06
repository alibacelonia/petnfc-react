import React, { useEffect, useRef } from 'react';

const SecurePayComponent: React.FC = () => {

  const cardPaymentClientRef = useRef(null);
  const securepayUiLoadedRef = useRef(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'securepay-ui-js';
    script.src = 'https://payments-stest.npe.auspost.zone/v3/ui/client/securepay-ui.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize SecurePay UI after script is loaded
      cardPaymentClientRef.current = new (window as any).securePayUI.init({
        containerId: 'securepay-ui-container',
        scriptId: 'securepay-ui-js',
        clientId: '0oaxb9i8P9vQdXTsn3l5',
        merchantCode: '5AR0055',
        card: {
          onTokeniseSuccess: function (tokenisedCard: any) {
            // Handle tokenization success
            console.info('tokenise data:', tokenisedCard)
          },
          onTokeniseError: function (errors: any) {
            // Handle tokenization error
            console.error('tokenise data:', errors)
          }
        },
        style: {
          backgroundColor: 'rgba(135, 206, 250, 0.1)',
          label: {
            font: {
                family: 'Arial, Helvetica, sans-serif',
                size: '1.1rem',
                color: 'darkblue'
            }
          },
          input: {
           font: {
               family: 'Arial, Helvetica, sans-serif',
               size: '1.1rem',
               color: 'darkblue'
           }
         }  
        },
        onLoadComplete: function () {
          securepayUiLoadedRef.current = true;
          console.log('securepay component loaded successfully');
        }
      });
    };

    return () => {
      // Cleanup script on component unmount
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div id="securepay-ui-container">
      {/* Your component content goes here */}
    </div>
  );
};

export default SecurePayComponent;
