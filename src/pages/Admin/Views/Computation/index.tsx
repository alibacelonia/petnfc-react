import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Alert,
  AlertIcon,
  Badge,
  Button,
  Checkbox,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";
import React, { ChangeEvent } from "react";
import { HiCheckBadge, HiEllipsisVertical, HiArrowPath } from "react-icons/hi2";
import { useLogic } from "./logic";
import { Controller } from "react-hook-form";
import { ChakraStylesConfig, Select } from "chakra-react-select";

const AdminComputationPage = () => {
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
    userData,
    setUserData,
    getUsers,
    control,
    handleSubmit,
    register,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    errors, 
    isSubmitting,
    formdata, 
    setFormData,
    deleteFee,
    chakraStyles,
    operations,
    onChangeSelect,
    onChangeInput,
    onSubmit,
    isOpenAlertDialog,
    onOpenAlertDialog,
    onCloseAlertDialog,
    cancelRef,
    isOpenModal,
    onOpenModal,
    onCloseModal,


  selectedFee,
  setSelectedFee,
  selectedID,
  setSelectedID
  } = useLogic();

  //   Pagination function
  const handlePageChange = async (value: number) => {
    setPageNumber(value);
  };

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

  const onDeleteFee = (id: string) => {
    setSelectedID(id);
    onOpenAlertDialog();
  }


  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Fees
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
              //   isDisabled={isDownloadingAll}
              onClick={onOpenModal}
            >
              Add Fee
            </Button>
            <Tooltip label="Refresh Data" placement="right">
              <IconButton
                // isDisabled={isDownloadingAll}
                aria-label="Refresh database"
                onClick={getUsers}
                icon={<HiArrowPath />}
              />
            </Tooltip>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="bg-white">
            <TableContainer>
              <Table size="sm">
                <Thead height={10}>
                  <Tr>
                    <Th>Type</Th>
                    <Th>Display Name</Th>
                    <Th>Amount</Th>
                    <Th>Operation</Th>
                    <Th>Included in Computation</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userData.length > 0 ? (
                    userData.map((data, index) => {
                      return (
                        <Tr key={data.id}>
                          <Td>{`${data.fee_type}`}</Td>
                          <Td>
                            <div className="flex flex-col justify-start items-start">
                              {`${data.display_name}`}
                            </div>
                          </Td>
                          <Td>{`${data.currency} ${data.amount}`}</Td>
                          <Td>{`${data.operation}`}</Td>
                          <Td>
                            {data.enabled ? (
                              <Badge variant="outline" colorScheme="blue">
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline" colorScheme="red">
                                No
                              </Badge>
                            )}
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<HiEllipsisVertical size={20} />}
                                variant="outline"
                              ></MenuButton>
                              <MenuList minWidth="150px">
                                <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                                <MenuItem icon={<DeleteIcon />} onClick={()=>{onDeleteFee(data.id)}}>
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr>
                      <Th colSpan={6} textAlign="center" height={16}>
                        No fees yet.
                      </Th>
                    </Tr>
                  )}
                </Tbody>

                <Tfoot>
                  <Tr>
                    <Td colSpan={6}>
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
      </div>
      
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModal}
        onClose={onCloseModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
        <ModalOverlay />
        <ModalContent rounded="sm">
          <ModalHeader
            bg="gray.200"
            color="gray.700"
            borderTop="4px"
            borderColor="blue.500"
            className="flex items-center justify-between"
          >
            <Text>Add Fee</Text>
            <CloseButton rounded="sm" color="gray.700" onClick={onCloseModal}/>
          </ModalHeader>

          <ModalBody pb={6}>
            <div className="mt-4">
              <FormControl isInvalid={!!errors.fee_type}>
                <FormLabel fontSize="sm" color="gray.900">
                  Type of Fee{" "}
                  <span className="text-red-500 text-base">*</span>
                </FormLabel>
                <Controller
                  name="fee_type"
                  control={control}
                  render={({ field }) => (
                      <Input
                        {...field}
                        type={ "text"}
                        fontSize="sm"
                        size="lg"
                        value={formdata.fee_type || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("fee_type", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("fee_type");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.fee_type && errors.fee_type.message}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="mt-4">
              <FormControl isInvalid={!!errors.display_name}>
                <FormLabel fontSize="sm" color="gray.900">
                  Display Name{" "}
                  <span className="text-red-500 text-base">*</span>
                </FormLabel>
                <Controller
                  name="display_name"
                  control={control}
                  render={({ field }) => (
                      <Input
                        {...field}
                        type={ "text"}
                        fontSize="sm"
                        size="lg"
                        value={formdata.display_name || ""}
                        
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("display_name", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("display_name");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.display_name && errors.display_name.message}
                </FormErrorMessage>
              </FormControl>
            </div>
            
            <div className="mt-4">
              <FormControl isInvalid={!!errors.amount}>
                <FormLabel fontSize="sm" color="gray.900">
                  Amount{" "}
                  <span className="text-red-500 text-base">*</span>
                </FormLabel>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                    {...field}
                    size="lg"
                      value={formdata.amount == 0 ? 0 : field.value}
                      keepWithinRange={true}
                      clampValueOnBlur={false}
                      onChange={(valueString, valueNumber) => {
                        if(Number.isNaN(valueNumber)) {
                          field.onChange("");
                        }
                        else{
                          field.onChange(valueNumber);
                        }


                        if(valueString == ""){
                          setError('amount', {type: 'manual', message: 'This is a required field.'})
                        }
                        else if(valueNumber < 1){
                          setError('amount', {type: 'manual', message: 'Minimum value for this field is 1.'})
                        }
                        else if(valueNumber > 500){
                          setError('amount', {type: 'manual', message: 'Maximum value for this field is 500.'})
                        }
                        else{
                          clearErrors("amount")
                        }

                        setFormData((prevData) => ({
                          ...prevData,
                          "amount": valueNumber,
                        }));
                      }}
                    >
                      <NumberInputField fontSize="sm" />
                    </NumberInput>
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.amount && errors.amount.message}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="mt-4">
              <FormControl isInvalid={!!errors.operation}>
                <FormLabel fontSize="sm" color="gray.900">
                  Operation{" "}
                  <span className="text-red-500 text-base">*</span>
                </FormLabel>
                <Controller
                  name="operation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="state"
                      {...field}
                      options={operations}
                      size="lg"
                      chakraStyles={chakraStyles}
                      placeholder="Select state"
                      onChange={(e, a) => {
                        clearErrors("operation")
                        field.onChange(e);
                        onChangeSelect(e, a);
                      }}
                    />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.operation && errors.operation.message}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="mt-4">
              <FormControl isInvalid={!!errors.enabled}>
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox onChange={(value)=>{
                      setFormData((prevData) => ({
                        ...prevData,
                        ['enabled']: value.target.checked,
                      }));
                    }}>Include in computation</Checkbox>
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.enabled && errors.enabled.message}
                </FormErrorMessage>
              </FormControl>
            </div>
          </ModalBody>

          <ModalFooter className="flex gap-2">
            <Button
            type="submit"
              bg="blue.500"
              color="white"
              fontSize="xs"
              rounded="sm"
              _hover={{ bg: "blue.600" }}
            >
              Save
            </Button>
            <Button
              bg="gray.100"
              color="gray.700"
              fontSize="xs"
              rounded="sm"
              _hover={{ bg: "gray.200" }}
              onClick={onCloseModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
        </form>
      </Modal>

      <AlertDialog
        isOpen={isOpenAlertDialog}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlertDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Fee
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlertDialog}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={async ()=>{
                await deleteFee(selectedID);
                onCloseAlertDialog();
              }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AdminComputationPage;
