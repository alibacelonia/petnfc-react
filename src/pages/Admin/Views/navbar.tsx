import {
  Box,
  IconButton,
  useColorModeValue,
  Text,
  Flex,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  MenuList,
  MenuItem,
  MenuDivider,
  FlexProps,
  Wrap,
  WrapItem,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Divider,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import useLogout from "../../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { PageInfoContext } from "../../../flux/navigation/store";
import React, { ChangeEvent, useState } from "react";
import { changePage } from "../../../flux/navigation/action";
import { UserInfoContext } from "../../../flux/user/store";
import { UserInfo } from "../../../flux/user/types";

import {
  HiOutlineChatAlt2,
  HiOutlineStar,
  HiOutlineX,
  HiStar,
} from "react-icons/hi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { axiosPrivate } from "../../../api/axios";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export type Inputs = {
  comment: string;
  rate: number;
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { userState } = React.useContext(UserInfoContext);
  const userInfo: UserInfo = userState?.userInfo;

  const {
    isOpen: isOpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();
  const logout = useLogout();
  const { pageDispatch } = React.useContext(PageInfoContext);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const [formdata, setFormData] = useState<Inputs>({ comment: "", rate: 0 });

  const onChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {

    clearErrors("comment");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      comment: value,
    }));
  };

  const handleClick = (page: string) => {
    // console.info("this is handleClick: ",page);
    pageDispatch(changePage(page));
  };

  const signOut = async () => {
    await logout().finally(() => {
      localStorage.clear();
      window.location.reload();
    });
  };

  return (
    <>
      <Box position="fixed" width="full" zIndex={20}>
        <Flex
          ml={{ base: 0, md: 60 }}
          px={{ base: 4, md: 4 }}
          height="20"
          alignItems="center"
          bg={useColorModeValue("white", "gray.900")}
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue("gray.200", "gray.700")}
          justifyContent={{ base: "space-between", md: "flex-end" }}
          {...rest}
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />

          <h1 className="flex md:hidden text-xl font-bold text-[#0E67B5]">
            PetNFC
          </h1>

          <HStack spacing={{ base: "0", md: "6" }}>
            {/* <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          /> */}
            <Flex alignItems={"center"} gap={4}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar
                      size={"sm"}
                      name={`${userInfo.firstname} ${userInfo.lastname}`}
                      src={""}
                      bg="blue.500"
                    />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm">{`${userInfo?.firstname} ${userInfo?.lastname}`}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {`${
                          userInfo?.role === "admin"
                            ? "Admin"
                            : userInfo?.role === "user"
                            ? "Pet Owner"
                            : "Pet Walker"
                        }`}
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "gray.900")}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <MenuItem onClick={() => handleClick("admin_profile")}>
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={signOut}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

export default MobileNav;
