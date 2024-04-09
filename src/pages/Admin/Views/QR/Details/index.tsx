import React, { useEffect, useState } from "react";
import { useLogic } from "./logic";
import { QRCodeSVG } from "qrcode.react";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
  AlertDescription,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import moment from "moment";
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  SearchIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  HiArrowPath,
  HiEllipsisVertical,
  HiLink,
  HiOutlineXMark,
} from "react-icons/hi2";
import axios, { axiosPrivate } from "../../../../../api/axios";
import { PetInfo } from "../../../../../flux/pets/types";
import { useForm } from "react-hook-form";
import { RiQrScan2Line } from "react-icons/ri";
import UserDetailsComponent from "../../Shared/Components/userDetails";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import { UserInfo } from "../../../../../flux/user/types";
import { changePage } from "../../../../../flux/navigation/action";
import { FiChevronLeft } from "react-icons/fi";
import PetDetailsComponent from "../../Shared/Components/petDetails";

const AdminQRDetails = () => {

  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const pd = pageState.pageData;

  const [petInfo, setPetInfo] = useState<PetInfo>(pd);
  const [owner, setOwner] = useState<UserInfo | null>(null);

  const download = async (data: PetInfo) => {
    // console.info("to be downloaded: ", data);
    await axios
      .post(`/pet/download-qr-image`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          // Accept: 'image/png', // Indicate that you expect a ZIP file in the response
        },
        withCredentials: true,
        responseType: "arraybuffer", // Indicate that the response should be treated as binary data
      })
      .then((response) => {
        // console.info("response: ", response);
        const blob = new Blob([response.data], { type: 'image/png' });

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download =  `${petInfo.name}_qrcode.png`;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getOwnerDetails = async () => {
    await axiosPrivate
      .get(`/pet/owner/${petInfo.owner_id}/details`)
      .then((response) => {
        setOwner(response.data)
      })
      .catch((error) => {
        pageDispatch(changePage("admin_users"))
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getOwnerDetails();
    };

    fetchData();
  }, []);
  
  const {
    isOpenGenerateModal,
    onOpenGenerateModal,
    onCloseGenerateModal,
    isAlertOpen,
    onCloseAlert,
    onOpenAlert,

    alertResponse,
  } = useLogic();

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">

        <div className={`flex items-center justify-center ${isAlertOpen ? "flex" : "none"}`}>
          <Alert
            status={alertResponse.status}
            display={isAlertOpen ? "flex" : "none"}
            alignItems="center"
            justifyContent="start"
          >
            <AlertIcon width={4} />
            <Box flexGrow={1}>
              <AlertTitle className="text-sm">{alertResponse.title}</AlertTitle>
              <AlertDescription className="text-sm">
                {alertResponse.message}
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              //   onClick={onCloseAlert}
            />
          </Alert>
        </div>


        <div className="flex justify-start items-center">
          <h1
            onClick={() => pageDispatch(changePage("admin_qr_codes", owner as UserInfo),)}
            className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"
          >
            <FiChevronLeft size={14} className="" /> Back
          </h1>
        </div>

        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            QR Code Details
          </h1>
        </div>

        <div className="relative bg-white rounded-2xl mt-5 px-10 py-10 lg:px-20 lg:py-12 mb-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center  gap-4 ">
            <div className="ring-offset-4 ring-4 ring-[#334155]">
                <QRCodeSVG
                              className="cursor-pointer"
                              value={`secure-petz.info/${petInfo.unique_id}`}
                              size={125}
                              fgColor="#334155"
                            />
            </div>

            <div className="flex flex-col gap-2 bg-blue-2000 grow items-center lg:items-start pt-4 lg:pl-4 w-full">
              <h1 className="flex items-center justify-start lowercase text-gray-700 gap-2 truncate w-full"><HiLink size={20}/>
                <p className=" text-blue-500 cursor-pointer">{`secure-petz.info/${petInfo.unique_id}`}</p>
              </h1>
              <h1 className="flex items-center justify-start lowercase text-gray-700 gap-2"><RiQrScan2Line size={20}/>{petInfo.no_of_scans || 0} scan(s)</h1>
              <h1 className="flex items-center justify-start lowercase text-gray-700 gap-2">
              <Button
                variant='outline'
                bg="white"
                color="blue.500"
                
                // size="sm"
                // fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.500", color: "white" }}
                // isDisabled={isDownloadingAll}
                onClick={() => {
                  // download(petInfo);
                }}
              >
                View Scan History
              </Button>
              <Button
                bg="blue.500"
                color="white"
                // size="sm"
                // fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
                // isDisabled={isDownloadingAll}
                onClick={() => {
                  download(petInfo);
                }}
              >
                Download
              </Button>
              </h1>
            </div>
          </div>
          {/* <Divider className="mt-8 mb-6"></Divider> */}
        </div>

        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Pet Owner Details
          </h1>
        </div>
        {/* Insert Pet Details Component Here */}
        {owner !== null && owner !== undefined ? <UserDetailsComponent userInfo={owner as UserInfo}/> : <></>}

        {/* Insert Pet Details Component Here */}
        {owner !== null && owner !== undefined ? <PetDetailsComponent title="Pet Details" petInfo={petInfo} ownerInfo={owner as UserInfo} viewOnly={true}/> : <></>}


      </div>
    </>
  );
};

export default AdminQRDetails;
