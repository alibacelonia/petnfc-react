import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiCompass,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiStar,
  FiTrendingUp,
  FiUser
} from "react-icons/fi";
import { BsQrCodeScan } from "react-icons/bs";
import { IconType } from "react-icons";
import NavItem from "./sidebarItem";
import { Dispatch, SetStateAction } from "react";
import { PageInfoContext } from "../../../flux/navigation/store";
import React from "react";
import { changePage } from "../../../flux/navigation/action";
import { UserInfoContext } from "../../../flux/user/store";
import { FaRegBell } from "react-icons/fa6";
interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {

  name: string;
  icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Profile", icon: FiUser },
  // { name: "Scan History", icon: BsQrCodeScan },
  { name: "Notifications", icon: FaRegBell },
  { name: "Settings", icon: FiSettings },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

const {pageDispatch} = React.useContext(PageInfoContext);
const { userState, userDispatch } = React.useContext(UserInfoContext);

const handleClick = (page: string) => {
    // console.info("this is handleClick: ",page);
    if(page=="settings"){
      pageDispatch(changePage(page, userState.userInfo))
    }
    else{
      pageDispatch(changePage(page))
    }
}
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      zIndex={30}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src="/logo/logo-blue.png" alt={""} width={12} />
          <h1 className="text-xl font-bold  text-[#0E67B5]">PetNFC</h1>
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link, idx) => (
        <NavItem key={idx} icon={link.icon} onClick={()=>{onClose(); handleClick((link.name.split(" ").join("_")).toLowerCase())}}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};


export default SidebarContent