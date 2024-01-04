import { Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState, memo } from "react";
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
import React from "react";
import AdminProfilePage from "./Profile";
import AdminUsersPage from "./Users";

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
    case "admin_orders":
      return <AdminOrdersPage />;
    case "admin_qr_codes":
      return <AdminQRPage />;
    case "admin_users":
      return <AdminUsersPage />;
    case "admin_profile":
      return <AdminProfilePage />;
    case "admin_settings":
      return <AdminSettingsPage />;
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

  return (
    <section
      ref={ref1}
      id="whybuyourproduct"
      className={`relative transition-opacity ease-in duration-300 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      } overflow-hidden`}
    >
      <div className="relative min-h-screen max-h-max bg-gray-100">
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
    </section>
  );
};

export default AdminPage;
