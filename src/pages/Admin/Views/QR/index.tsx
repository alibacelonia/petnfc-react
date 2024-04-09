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
import BottomSheet from "../../../../common/bottomsheet";
import {
  HiArrowPath,
  HiEllipsisVertical,
  HiOutlineXMark,
} from "react-icons/hi2";
import axios, { axiosPrivate } from "../../../../api/axios";
import { PetInfo } from "../../../../flux/pets/types";
import { useForm } from "react-hook-form";
import { PageInfoContext } from "../../../../flux/navigation/store";
import { changePage } from "../../../../flux/navigation/action";

const AdminQRPage = () => {

  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const {
    pageNumber,
    setPageNumber,
    pageLimit,
    setPageLimit,
    search,
    setSearch,
    filters,
    setFilters,
    totalPages,
    totalItems,
    qrData,
    setQrData,
    getQRCodes,
    registerGenerate,
    errorsGenerate,
    isGenerateSubmitting,
    handleGenerateSubmit,
    resetGenerate,
    onSubmitGenerate,
    alertResponse,
    generateData,
    setGenerateData,
    isOpenGenerateModal,
    onOpenGenerateModal,
    onCloseGenerateModal,
    isAlertOpen,
    onCloseAlert,
    onOpenAlert,
  } = useLogic();

  const {
    handleSubmit: handleDownloadAll,
    formState: { isSubmitting: isDownloadingAll },
  } = useForm();

  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [allChecked, setAllChecked] = React.useState(false);

  const handleSelectAllChange = (e: any) => {
    const newCheckedState = e.target.checked;
    setAllChecked(newCheckedState);
    setCheckedItems(new Array(qrData.length).fill(newCheckedState));
  };

  const handleCheckboxChange = (index: any) => (e: any) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = e.target.checked;
    setCheckedItems(newCheckedItems);
    setAllChecked(checkAllChecked(newCheckedItems));
  };

  const handlePageChange = async (value: number) => {
    setPageNumber(value);
  };

  const handleClose = () => {
    setBottomSheetOpen(false);
  };

  const checkAllChecked = (items: any) => items.every((item: any) => item);
  const checkSomeChecked = (items: any) => items.some((item: any) => item);

  const renderPageButtons = () => {
    const buttons = [];

    const renderButton = (value: number) => (
      <Button
        // isDisabled={true}
        key={value}
        onClick={() => handlePageChange(value)}
        position="relative"
        display="inline-flex"
        px={0}
        py={0}
        as="button"
        rounded="none"
        fontWeight="semibold"
        ring="1"
        ringInset="inset"
        ringColor="gray.300"
        bg={pageNumber === value ? "blue.500" : "white"}
        textColor={pageNumber === value ? "white" : "gray.700"}
        _hover={{
          bg: pageNumber === value ? "blue.600" : "gray.50",
          textColor: pageNumber === value ? "white" : "gray.700",
        }}
        _focus={{
          bg: "sky.600",
          outline: "none",
          boxShadow: "outline",
          ring: "0",
        }}
      >
        {value}
      </Button>
    );

    if (totalPages <= 10) {
      // Display all buttons when there are 10 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(renderButton(i));
      }
    } else {
      // Display a subset of buttons with ellipses
      if (pageNumber <= 4) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(renderButton(i));
        }
        buttons.push(
          <span
            key="ellipsis1"
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-inset ring-gray-300 ${
              false
                ? "ring-0 cursor-not-allowed opacity-50 "
                : "ring-1  opacity-100"
            }`}
          >
            ...
          </span>
        );
        buttons.push(renderButton(totalPages));
      } else if (pageNumber >= totalPages - 3) {
        buttons.push(renderButton(1));
        buttons.push(
          <span
            key="ellipsis2"
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-inset ring-gray-300 ${
              false
                ? "ring-0 cursor-not-allowed opacity-50 "
                : "ring-1  opacity-100"
            }`}
          >
            ...
          </span>
        );
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(renderButton(i));
        }
      } else {
        buttons.push(renderButton(1));
        buttons.push(
          <span
            key="ellipsis3"
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-inset ring-gray-300 ${
              false
                ? "ring-0 cursor-not-allowed opacity-50 "
                : "ring-1  opacity-100"
            }`}
          >
            ...
          </span>
        );
        for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
          buttons.push(renderButton(i));
        }
        buttons.push(
          <span
            key="ellipsis4"
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-inset ring-gray-300 ${
              false
                ? "ring-0 cursor-not-allowed opacity-50 "
                : "ring-1  opacity-100"
            }`}
          >
            ...
          </span>
        );
        buttons.push(renderButton(totalPages));
      }
    }

    return buttons;
  };

  const download = async (data: PetInfo[]) => {
    // console.info("to be downloaded: ", data);
    await axios
      .post(`/pet/generate_qr_zip`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/zip", // Indicate that you expect a ZIP file in the response
        },
        withCredentials: true,
        responseType: "arraybuffer", // Indicate that the response should be treated as binary data
      })
      .then((response) => {
        // console.info("response: ", response);
        const blob = new Blob([response.data], { type: "application/zip" });

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qr_codes.zip";
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const downloadAll = async () => {
    // console.info("to be downloaded: ", data);
    await axios
      .post(
        `/pet/generate-qr-all`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/zip", // Indicate that you expect a ZIP file in the response
          },
          withCredentials: true,
          responseType: "arraybuffer", // Indicate that the response should be treated as binary data
        }
      )
      .then((response) => {
        // console.info("response: ", response);
        const blob = new Blob([response.data], { type: "application/zip" });

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qr_codes.zip";
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const downloadSingle = async (data: PetInfo) => {
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
      link.download =  `${data.name || data.unique_id}_qrcode.png`;
      link.click();
    })
    .catch((err) => {
      console.error(err);
    });
  };

  const downloadSelected = async () => {
    const filteredArray = qrData.filter((person, index) => checkedItems[index]);
    await download(filteredArray);
  };

  useEffect(() => {
    setCheckedItems(new Array(qrData.length).fill(false));
  }, [qrData]);

  useEffect(() => {
    if (!checkedItems.filter((value) => value).length) {
      setAllChecked(false);
    }
  }, [checkedItems]);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-center justify-center mt-4">
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
              onClick={onCloseAlert}
            />
          </Alert>
        </div>

        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            QR Codes
          </h1>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
          <div className="flex gap-2">
            <Button
              bg="blue.500"
              color="white"
              fontSize="xs"
              rounded="sm"
              _hover={{ bg: "blue.600" }}
              isDisabled={isDownloadingAll}
              onClick={() => {
                onOpenGenerateModal();
              }}
            >
              Generate QR Code
            </Button>
            <Tooltip label="Refresh Data" placement="right">
              <IconButton
                isDisabled={isDownloadingAll}
                aria-label="Search database"
                onClick={getQRCodes}
                icon={<HiArrowPath />}
              />
            </Tooltip>
          </div>
          {/* <div className="">
            <InputGroup size='md'>
              <Input
                bg="white"
                htmlSize={35}
                pr='4.5rem'
                type="text"
                fontSize="xs"
                placeholder='Search for ...'
              />
              <InputRightElement width='4.5rem'>
                
              <Button
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
                onClick={() => {
                }}
              >
                Search
              </Button>
              </InputRightElement>
            </InputGroup>
          </div> */}
        </div>

        <div className="relative min-h-screen mt-5">
          <div className="bg-white">
            <TableContainer>
              <Table size="sm">
                <Thead height={10}>
                  <Tr>
                    <Th width={5}>
                      <Checkbox
                        size="lg"
                        isChecked={allChecked}
                        isIndeterminate={
                          checkSomeChecked(checkedItems) &&
                          !checkAllChecked(checkedItems)
                        }
                        onChange={handleSelectAllChange}
                      ></Checkbox>
                    </Th>
                    <Th>QR Code</Th>
                    <Th width={52}>
                      <div className="flex items-center justify-between gap-2">
                        <h1>Status</h1>
                        <Menu closeOnSelect={true}>
                          <MenuButton
                            // isDisabled={true}
                            as={IconButton}
                            aria-label="Options"
                            icon={<HiEllipsisVertical size={20} />}
                            variant="outline"
                            style={{
                              boxShadow: "none",
                              border: "none",
                            }}
                          ></MenuButton>
                          <MenuList minWidth="150px">
                            <MenuOptionGroup
                              defaultValue="all"
                              title="Status"
                              type="radio"
                              onChange={(e) => {
                                setPageNumber(1);
                                setFilters("qr=" + e);
                              }}
                            >
                              <MenuItemOption value="all">All</MenuItemOption>
                              <MenuItemOption value="not-used">
                                Available
                              </MenuItemOption>
                              <MenuItemOption value="used">
                                Taken
                              </MenuItemOption>
                            </MenuOptionGroup>
                          </MenuList>
                        </Menu>
                      </div>
                    </Th>
                    <Th>Date Created</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {qrData.map((data, index) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Checkbox
                            size="lg"
                            colorScheme="blue"
                            name="qr"
                            value={data.unique_id}
                            isChecked={checkedItems[index]}
                            onChange={handleCheckboxChange(index)}
                          ></Checkbox>
                        </Td>
                        <Td>
                          <div className="flex justify-center items-start gap-2">
                            <QRCodeSVG
                              className="cursor-pointer"
                              value={`https://secure-petz.info/${data.unique_id}`}
                              size={50}
                              fgColor="#0284c7"
                            />
                          </div>
                        </Td>
                        <Td className="table-fixed w-72">
                          <div className="flex gap-2">
                            {data.owner_id ? (
                              <Badge variant="solid" colorScheme="blue">
                                Taken
                              </Badge>
                            ) : (
                              <Badge variant="solid">Available</Badge>
                            )}
                          </div>
                        </Td>

                        <Td className="table-fixed w-72 md:w-80">
                          <div className="flex gap-2">
                            {moment(data.created_at).format("lll")}
                            {moment().diff(moment(data.created_at), "days") <
                            2 ? (
                              <Badge variant="outline" colorScheme="blue">
                                New
                              </Badge>
                            ) : (
                              ""
                            )}
                          </div>
                        </Td>
                        <Td className="table-fixed w-72 md:w-96">
                          <div className="hidden sm:flex justify-center items-center gap-2">

                            <div className={`${data.owner_id ? "block" : "hidden"}`}>
                                <Button
                                colorScheme="blue"
                                variant='outline'
                                // bg="blue.500"
                                // color="white"
                                size="sm"
                                fontSize="xs"
                                rounded="sm"
                                _hover={{ bg: "blue.600", textColor: "white" }}
                                onClick={()=>{
                                  data.owner_id ? 
                                  pageDispatch(changePage("admin_qr_codes_details", data)) : void 0;
                                }}
                                >
                                View Details
                                </Button>
                            </div>
                            <Button
                              bg="blue.500"
                              color="white"
                              size="sm"
                              fontSize="xs"
                              rounded="sm"
                              _hover={{ bg: "blue.600" }}
                              isDisabled={isDownloadingAll}
                              onClick={() => {
                                downloadSingle(data);
                              }}
                            >
                              Download
                            </Button>
                          </div>
                          <div className="block sm:hidden">
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<HiEllipsisVertical size={20} />}
                                variant="outline"
                                style={{
                                  boxShadow: "none",
                                  border: "none",
                                }}
                              ></MenuButton>
                              <MenuList minWidth="150px">
                               
                                <MenuItem
                                  isDisabled={isDownloadingAll}
                                  icon={<DownloadIcon />}
                                  onClick={() => {
                                    downloadSingle(data);
                                  }}
                                >
                                  Download
                                </MenuItem>
                                <MenuItem
                                  icon={<ViewIcon />}
                                  isDisabled={isDownloadingAll || data.owner_id === null}
                                  onClick={()=>{
                                    data.owner_id ? 
                                    pageDispatch(changePage("admin_qr_codes_details")) : void 0;
                                  }}
                                >
                                  View Details
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>

                <Tfoot>
                  <Tr>
                    <Td colSpan={5}>
                      <div className=" bg-white py-3 ">
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
                          <div className="">
                            <p className="text-sm text-gray-700">
                              Showing{" "}
                              <span className="font-medium">
                                {(pageNumber - 1) * pageLimit + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-medium">
                                {Math.min(pageLimit * pageNumber, totalItems)}
                              </span>{" "}
                              of{" "}
                              <span className="font-medium">{totalItems}</span>{" "}
                              results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                              aria-label="Pagination"
                            >
                              <Button
                                as="button"
                                roundedLeft="md"
                                roundedRight="none"
                                px="0"
                                py="0"
                                bg="white"
                                color="gray.400"
                                ring="1"
                                ringInset="inset"
                                ringColor="gray.300"
                                _hover={{ bg: "gray.50" }}
                                _focus={{ z: "20", outlineOffset: "0" }}
                                onClick={() => handlePageChange(pageNumber - 1)}
                                isDisabled={pageNumber === 1}
                              >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon boxSize={5} />
                              </Button>

                              {renderPageButtons()}

                              <Button
                                as="button"
                                roundedLeft="none"
                                roundedRight="md"
                                px="0"
                                py="0"
                                bg="white"
                                color="gray.400"
                                ring="1"
                                ringInset="inset"
                                ringColor="gray.300"
                                _hover={{ bg: "gray.50" }}
                                _focus={{ z: "20", outlineOffset: "0" }}
                                onClick={() => handlePageChange(pageNumber + 1)}
                                isDisabled={pageNumber === totalPages}
                              >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon boxSize={5} />
                              </Button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </div>
        </div>
        {checkSomeChecked(checkedItems) && (
          <div className="relative">
            <div className="fixed bottom-0 left-0 border-t-2 border-slate-200 pl-0 md:pl-60 w-full bg-white p-4 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="pl-4 m-0 font-semibold text-gray-700 text-sm lg:text-base grow">{`${
                checkedItems.filter((value) => value).length
              } QR code selected`}</p>

              <Button
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
                isDisabled={isDownloadingAll}
                // className="outline outline-offset-2 outline-2 outline-sky-600 text-sky-600 rounded-md px-4 py-2 font-bold text-sm lg:text-base"
                onClick={downloadSelected}
              >
                Download Selected
              </Button>
              <Button
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
                isDisabled={isDownloadingAll}
                isLoading={isDownloadingAll}
                loadingText="Zipping QR Codes..."
                onClick={handleDownloadAll(downloadAll)}
              >
                Download All{" "}
                {totalItems
                  ? `(${totalItems} record${totalItems > 1 ? "s" : ""})`
                  : ""}
              </Button>
              <div
                className="pr-2 pl-4 hidden sm:block"
                onClick={() => {
                  if (isDownloadingAll) {
                  } else {
                    setCheckedItems(new Array(qrData.length).fill(false));
                    setAllChecked(false);
                  }
                }}
              >
                <HiOutlineXMark />
              </div>

              <div
                className="absolute top-4 right-4 block sm:hidden z-50"
                onClick={() => {
                  if (isDownloadingAll) {
                  } else {
                    setCheckedItems(new Array(qrData.length).fill(false));
                    setAllChecked(false);
                  }
                }}
              >
                <HiOutlineXMark />
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpenGenerateModal}
        onClose={onCloseGenerateModal}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleGenerateSubmit(onSubmitGenerate)}>
            <ModalHeader className="text-gray-700">
              Generate QR Codes
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel className="text-gray-700">
                  Number of QR Codes to be generated
                </FormLabel>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={1000}
                  onChange={(val, num) =>
                    setGenerateData({ number_records: num })
                  }
                  value={generateData.number_records}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {/* <Input placeholder='First name' className="text-gray-700"/> */}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                mr={3}
                isLoading={isGenerateSubmitting}
                loadingText="Generating..."
                isDisabled={isGenerateSubmitting}
              >
                Generate
              </Button>
              <Button
                onClick={onCloseGenerateModal}
                isDisabled={isGenerateSubmitting}
                className="text-gray-700"
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminQRPage;
