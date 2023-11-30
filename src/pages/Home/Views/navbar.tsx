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
  HiChatBubbleLeftEllipsis,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { PiChatsDuotone } from "react-icons/pi";
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

  const stars = () => {
    const arr = Array.from({ length: 5 });
    return arr.map((_, index) => {
      return formdata.rate < index + 1 ? (
        <HiOutlineStar
          key={index}
          size={55}
          onClick={() => {
            clearErrors("rate");
            setFormData((prevData) => ({
              ...prevData,
              rate: index + 1,
            }));
            stars();
          }}
        />
      ) : (
        <HiStar
          className="text-yellow-500"
          key={index}
          size={55}
          onClick={() => {
            clearErrors("rate");
            setFormData((prevData) => ({
              ...prevData,
              rate: index + 1,
            }));
            stars();
          }}
        />
      );
    });
  };


  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {

    if (formdata.rate == 0){
      setError("rate", { type: 'manual', message:"Kindly assign a star rating."})
      return 
    }
    
    if (formdata.comment == ""){
      setError("comment", { type: 'manual', message:"We appreciate your comments. Kindly share your comments with us."})
      return
    }
    
    return axiosPrivate.post(`/feedback`, formdata)
      .then((response) => {
        setFormData({"comment": "", rate: 0})

        toast({
          position: "top",
          title: "Feedback Successfully Submitted",
          description:
            "Thank you for your input. Your comments have played a role in refining our website and services.",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
        onCloseModal1();
      })
      .catch((err) => {
        
        console.log(err)
        toast({
          position: "top",
          title: err.message,
          description:err.response.data.detail,
          status: "error",
          isClosable: true,
          duration: 4000,
        });
      });
  }

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
              <div className="relative">
                <button
                  onClick={onOpenModal1}
                  className="relative rounded-full bg-gray-100 px-2 py-2 z-50"
                >
                  {/* <span className="absolute top-1 right-0 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span> */}
                  <HiOutlineChatAlt2
                    size={22}
                    className="relative text-gray-700 z-50"
                  />
                </button>

                <span className="animate-ping top-0 left-0 absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-50 z-40"></span>
              </div>
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
                  <MenuItem onClick={() => handleClick("profile")}>
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

      <Modal
        size="lg"
        closeOnOverlayClick={false}
        isOpen={isOpenModal1}
        onClose={onCloseModal1}
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) '
        />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="text-gray-700 mt-2 mb-4">
            <div className="flex flex-row gap-1 items-center">
              <HiOutlineChatAlt2
                size={22}
                className="relative text-gray-700 z-50"
              />
              <h1 className="text-base grow">Feedback</h1>
              <HiOutlineX
                size={18}
                className="cursor-pointer"
                onClick={onCloseModal1}
              />
            </div>
            <Divider className="py-2"></Divider>
          </ModalHeader>
          <ModalBody pb={6}>
            <div className="mb-6">
              <h1 className="text-2xl text-center font-bold text-gray-700">
                What are your impressions of our website?
              </h1>
              <p className="text-center text-sm text-gray-700 mt-2 px-6">
                We appreciate your thoughts, as they help us better grasp your
                needs and customize our service to meet them.
              </p>
            </div>
            <div className=" mb-6">
              <FormControl isInvalid={!!errors.rate}>
                <div className="flex flex-row gap-1 justify-center items-center">
                  {stars()}
                </div>
                <FormErrorMessage className="flex justify-center">
                  <p className="text-xs text-center">{errors.rate && errors.rate.message}</p>
                </FormErrorMessage>
              </FormControl>
            </div>

            <FormControl isInvalid={!!errors.comment}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    bg="gray.50"
                    placeholder="Add a comment..."
                    borderRadius="md"
                    fontSize="sm"
                    size="sm"
                    cols={2}
                    rows={6}
                    value={formdata.comment || ""}
                    onChange={onChangeTextArea}
                  />
                )}
              />
              <FormErrorMessage fontSize="xs">
                {errors.comment && errors.comment.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
          <Button
            isDisabled={isSubmitting}
            type="submit"
            py={6}
            color='white'
            borderRadius='md'
            w="full"
            bgGradient='linear(to-r, blue.600, blue.300)'
            _hover={{
              bgGradient:'linear(to-r, blue.600, blue.300)'
            }}
          >
            Submit
          </Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MobileNav;
