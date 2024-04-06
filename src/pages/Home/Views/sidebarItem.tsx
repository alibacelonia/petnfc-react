import { Box, Flex, FlexProps, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { PageInfoContext } from "../../../flux/navigation/store";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;

}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  
  const {pageState} = React.useContext(PageInfoContext)

  const currentPage = pageState.selectedPage

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
        {children}
      </Flex>
    </Box>
  );
};

export default NavItem;
