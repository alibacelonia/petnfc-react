import { Badge, Box, Flex, FlexProps, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { PageInfoContext } from "../../../flux/navigation/store";
import { axiosPrivate } from "../../../api/axios";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;

}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  
  const {pageState} = React.useContext(PageInfoContext)

  const currentPage = pageState.selectedPage

  const [isSeenNotification, setIsSeenNotification] = useState(false);

  const [unreadNotifCount, setUnreadNotifCount] = useState(0); // Example state variable


  const getUnreadNotificationCount = () => {
    axiosPrivate.get(`/pet/unread/notifications/count`)
    .then((response) => {
      setUnreadNotifCount(response.data.count)  
     })
    .catch((error) => {console.error(error)});
  };

  const readNotifications = () => {
    axiosPrivate.get(`/pet/notifications/read`)
    .then((response) => {
      // console.log(response.data)
     })
    .catch((error) => {console.error(error)});
  };

  // useEffect(() => {
  //   const pingInterval = setInterval(() => {
  //     getUnreadNotificationCount();


  //   }, 5000); // Ping interval in milliseconds

  //   return () => {
  //     clearInterval(pingInterval);
  //   };
  // }, [unreadNotifCount]);

  useEffect(() => {
    if(currentPage === "notifications" && unreadNotifCount > 0) {
      readNotifications();
    }
  }, [currentPage]);

  return (
    <Box
    //   as="a"
    //   href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        mt={1}
        bg={children?.toString().toLowerCase() == currentPage.split('_')[0] ? "blue.500" : ""}
        color={children?.toString().toLowerCase() == currentPage.split('_')[0] ? "white" : ""}
        align="center"
        px={4}
        py={3}
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "blue.500",
          color: "white",
          transitionDuration: '0.25s',
          transitionTimingFunction: "ease-in-out"
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
              transitionDuration: '0.25s',
              transitionTimingFunction: "ease-in-out"
            }}
            as={icon}
          />
        )}
        <h1 className="grow">{children}</h1>
        {children === "Notifications" && unreadNotifCount > 0 && currentPage != "notifications" ? <Badge variant="solid" borderRadius={100} colorScheme='red' padding={1}></Badge> : ""}
      </Flex>
    </Box>
  );
};

export default NavItem;
