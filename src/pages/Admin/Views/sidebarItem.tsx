import { Box, Flex, FlexProps, Icon } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IconType } from "react-icons";
import { PageInfoContext } from "../../../flux/navigation/store";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;

}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {

  const {pageState} = React.useContext(PageInfoContext)

  const pg = `admin_${(children as string).replace(' ', '_')}`.toLowerCase();
  const currentPage = pageState.selectedPage == "home" ? "admin_home" : pageState.selectedPage

// Split the string into an array and destructure the first two elements
const splitted = currentPage.split('_');

// Combine the first two elements
const combinedElements = splitted[1] == "qr" ? `${splitted[0]}_${splitted[1]}_${splitted[2]}` : `${splitted[0]}_${splitted[1]}`;


// console.info(pg)
// console.info(combinedElements)

  return (
    <Box
    //   as="a"
    //   href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        mt={1}
        bg={pg == combinedElements ? "blue.500" : ""}
        color={pg == combinedElements ? "white" : ""}
        // gap={2}
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
            fontSize={children == "Users" ? 18 : 16}
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
