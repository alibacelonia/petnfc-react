import { Alert, AlertIcon, AlertTitle, Drawer, DrawerContent, useDisclosure, useBreakpointValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import MobileNav from "./navbar";
import SidebarContent from "./sidebar";
import { useLogic } from "./logic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboardPage from "./Dashboard";
import AdminFeedbackPage from "./Feedbacks";
import AdminOrdersPage from "./Orders";
import AdminQRPage from "./QR";
import AdminSettingsPage from "./Settings";
import { PageInfoContext } from "../../../flux/navigation/store";
import AdminProfilePage from "./Profile";
import AdminUsersPage from "./Users";
import AdminComputationPage from "./Computation";
import AdminProductsPage from "./Products";
import AdminUserDetailsPage from "./Users/Details";
import AdminQRDetails from "./QR/Details";
import AdminPetDetailsPage from "./Users/Details/PetDetails";


import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export function useIsVisible(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
// Define a type for the props
interface RenderPageProps {
  currentPage: string; // Change the type according to your needs
}

const RenderPage: React.FC<RenderPageProps> = ({ currentPage }) => {
  switch (currentPage) {
    case "admin_home":
      return <AdminDashboardPage />;
    case "admin_feedbacks":
      return <AdminFeedbackPage />;
    case "admin_products":
      return <AdminProductsPage />;
    case "admin_orders":
      return <AdminOrdersPage />;
    case "admin_qr_codes":
      return <AdminQRPage />;
    case "admin_qr_codes_details":
      return <AdminQRDetails />;
    case "admin_users":
      return <AdminUsersPage />;
    case "admin_users_pet_details":
        return <AdminPetDetailsPage />;
    case "admin_users_details":
      return <AdminUserDetailsPage />;
    case "admin_profile":
      return <AdminProfilePage />;
    case "admin_settings":
      return <AdminSettingsPage />;
    case "admin_fees":
      return <AdminComputationPage />;
    default:
      return <AdminDashboardPage />;
  }
};

// Memoize the component to optimize performance
const MemoizedRenderPage = memo(RenderPage);

const AdminPage = () => {
  useEffect(() => {
    // console.log("first runt");
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentPage, previousPageInfo } = useLogic();

  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const [socketUrl, setSocketUrl] = useState("ws:/localhost:8000/ws");
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const didUnmount = useRef(true);

  const handleOnWebsocketError = (event: WebSocketEventMap['error']) => {
    console.error(event)
  }


  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 3600,
    reconnectInterval: 3000,
    onError: (error) => handleOnWebsocketError(error)
  });

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (readyState === 1) { // Check if WebSocket connection is open
        sendMessage('ping');
      }
    }, 1000); // Ping interval in milliseconds

    return () => {
      clearInterval(pingInterval);
    };
  }, [sendMessage, readyState]);

  useEffect(() => {
    if (lastMessage && lastMessage.data === 'pong') {
      setMessageHistory(prevHistory => {
        // If the history exceeds 50 messages, slice it to contain only the latest 50 messages
        if (prevHistory.length >= 5) {
          return [...prevHistory.slice(4), lastMessage];
        } else {
          return [...prevHistory, lastMessage];
        }
      });
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const isReconnecting = readyState === ReadyState.CONNECTING && messageHistory.length > 0;
  const iconSize = useBreakpointValue({ base: "xs", lg: "sm" });

  const [isVisibleConnection, setIsVisible] = useState(true);

  // Function to toggle visibility after a delay
  const hideComponentWithDelay = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Change delay as per your requirement (in milliseconds)
  };

  // Call hideComponentWithDelay when component is mounted
  React.useEffect(() => {
    if (connectionStatus === "Open"){
      hideComponentWithDelay();
    }
    else{
      setIsVisible(true);
    }
  }, [connectionStatus]);

  return (
    <section
      ref={ref1}
      id="whybuyourproduct"
      className={`relative transition-opacity ease-in duration-300
       ${isVisible1 ? "opacity-100" : "opacity-0" } 
       overflow-hidden`}
    >
      <div className={`relative min-h-screen max-h-max bg-gray-100`}>
      {/* <div className={`relative min-h-screen max-h-max bg-gray-100 ${connectionStatus === "Open" ? "" : "pt-12"}`}> */}
        <SidebarContent
          onClose={onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        
        <div className="relative pt-24">
          <MemoizedRenderPage currentPage={currentPage} />
        </div>

      </div>
      <ToastContainer />
      <Modal size={"full"} blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={connectionStatus === "Closed"} onClose={onClose}>
      {/* <Modal size={"full"} blockScrollOnMount={true} closeOnOverlayClick={false} isOpen={isVisibleConnection && messageHistory.length > 0} onClose={onClose}> */}
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
      />
      <ModalContent bg={"transparent"}>
        <div className={`z-50 w-full ${!isVisibleConnection ? "hidden" : "block"}`}>
          <Alert status={connectionStatus === "Open" ? "success" : connectionStatus === "Connecting" ? "warning" : "error"} className="flex justify-center items-center">
            <AlertIcon width={4} h={4}/>
            <AlertTitle className="text-xs sm:text-sm"> {connectionStatus === "Open" ? "Connected." : isReconnecting ? "Reconnecting..." : "Can't connect to the server. Kindly check your internet connection."}</AlertTitle>
          </Alert>
        </div>
      </ModalContent>
      </Modal>
    </section>

    
  );
};

export default AdminPage;
