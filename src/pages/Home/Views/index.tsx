import { Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import MobileNav from "./navbar";
import SidebarContent from "./sidebar";
import PetsPage from "./Pets";
import FeedbackPage from "./Feedback";
import SettingsPage from "./Settings";
import PetDetailsPage from "./Pets/PetDetails";
import PetAddPage from "./Pets/PetAdd";
import PetEditPage from "./Pets/PetEdit";
import ProfilePage from "./Profile";
import { useLogic } from "./logic";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentPage } = useLogic();

  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <PetsPage />;
      case "home_pet_details":
        return <PetDetailsPage />;
      case "home_register_pet":
        return <PetAddPage />;
      case "home_edit_pet_details":
        return <PetEditPage />;
      case "profile":
        return <ProfilePage />;
      case "feedback":
        return <FeedbackPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <PetsPage />;
    }
  };

  return (
    <section 
    ref={ref1}
    id="whybuyourproduct"
    className={`transition-opacity ease-in duration-300 ${
      isVisible1 ? "opacity-100" : "opacity-0"
    } overflow-hidden`}>
      <div className="min-h-screen max-h-max bg-gray-100">
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
        <div className="relative pt-24">{renderPage()}</div>
      </div>
    <ToastContainer />
    </section>
  );
};

export default HomePage;
