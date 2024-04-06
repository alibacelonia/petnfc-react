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
import { IconType } from "react-icons";
import NavItem from "./sidebarItem";
import { Dispatch, SetStateAction } from "react";
import { PageInfoContext } from "../../../flux/navigation/store";
import React from "react";
import { changePage } from "../../../flux/navigation/action";
import { UserInfoContext } from "../../../flux/user/store";
import { HiOutlineQrCode, HiOutlineUserGroup, HiOutlineShoppingBag } from "react-icons/hi2";
import { RiShoppingCartLine } from "react-icons/ri";
import { BiMath } from "react-icons/bi";


interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  id: number;
  name: string;
  icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
  { id: 1, name: "Home", icon: FiHome },
  { id: 2, name: "QR Codes", icon: HiOutlineQrCode },
  { id: 3, name: "Users", icon: HiOutlineUserGroup },
  { id: 4, name: "Products", icon: HiOutlineShoppingBag },
  { id: 5, name: "Orders", icon: RiShoppingCartLine },
  { id: 6, name: "Feedbacks", icon: FiMessageSquare },
  { id: 7, name: "Profile", icon: FiUser },
  { id: 8, name: "Fees", icon: BiMath },
  { id: 9, name: "Settings", icon: FiSettings },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

const {pageDispatch} = React.useContext(PageInfoContext);
const { userState, userDispatch } = React.useContext(UserInfoContext);

const handleClick = (page: string) => {
    const pg = `admin_${page.replace(' ', '_')}`;
    // console.info("this is handleClick: ",pg);
    if(pg=="admin_settings"){
      pageDispatch(changePage(pg, userState.userInfo))
    }
    else{
      pageDispatch(changePage(pg))
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
        <NavItem key={idx} icon={link.icon} onClick={()=>{onClose(); handleClick(link.name.toLowerCase())}}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};


export default SidebarContent