import {
  ChevronLeftIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Checkbox,
  IconButton,
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
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  CloseButton,
  FormControl,
  Text,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Icon,
} from "@chakra-ui/react";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { HiArrowPath, HiEllipsisVertical, HiMiniXMark, HiOutlinePlusCircle } from "react-icons/hi2";
import { ProductInfo } from "../../../../flux/product/types";
import useLogic from "./logic";
import { Controller, UseFormRegisterReturn, useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import { S3,S3Client, ListBucketsCommand, ListBucketsCommandOutput  } from "@aws-sdk/client-s3";
import axios from "../../../../api/axios";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
  refElem: React.MutableRefObject<HTMLInputElement | null>;
  onChangeCallback: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children, refElem, onChangeCallback } = props;
  const inputRef = refElem;
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  return (
    <div className=" grid grid-flow-row-dense grid-cols-4 gap-2">
      <input
        type={"file"}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        onChange={onChangeCallback}
      />
      <>{children}</>
    </div>
  );
};

const AdminProductsPage = () => {

  const selectImageRef = useRef<HTMLInputElement | null>(null);
  const handleSelectImage = () => selectImageRef.current?.click();
  const {
    products,
    control,
    handleSubmit,
    register,
    errors, 
    isSubmitting,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    isOpenModal,
    onOpenModal,
    onCloseModal,
    formdata,
    setFormData,
    onChangeSelect,
    onChangeInput,
    onSubmit,

    isOpenAlertDialog,
    onOpenAlertDialog,
    onCloseAlertDialog,
    cancelRef,
    validateFiles,

    imagePreviews, 
    setImagePreviews,
    handleFileChange,
    handleRemovePreview,
    files,
    setFiles
  } = useLogic();
  

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        {/* <Alert status="info">
          <AlertIcon />
          This page is currently under development. We apologize for any inconvenience.
        </Alert> */}
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Products
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
              Add Product
            </Button>
            <Tooltip label="Refresh Data" placement="right">
              <IconButton
                // isDisabled={isDownloadingAll}
                aria-label="Refresh database"
                // onClick={getUsers}
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
                    <Th>Product Image</Th>
                    <Th>Product Name</Th>
                    <Th>Amount</Th>
                    <Th>Discount</Th>
                    <Th>Is Displayed</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products.length > 0 ? (
                    products.map((product: ProductInfo) => {
                      return (
                        <Tr key={product.productId}>
                          <Th className="" width={32}>
                            <img
                              className="inline-block h-16 w-20 object-cover "
                              src={`${product.imageUrl}`}
                              alt="Pet Image"
                            />
                          </Th>
                          <Th className="justify-center w-32">
                            <h1 className="uppercase">{product.productName}</h1>
                          </Th>
                          <Th>
                            <h1 className="uppercase">
                              ${product.price.toFixed(2)}
                            </h1>
                          </Th>
                          <Th>
                            <p className="grow text-gray-700 uppercase">
                              <Badge
                                variant="outline"
                                fontSize="10"
                                colorScheme="red"
                              >
                                {product.discount.type == "fixed"
                                  ? `$${product.discount.value}`
                                  : `${product.discount.value}%`}{" "}
                                OFF
                              </Badge>
                            </p>
                            <p className="grow text-gray-700 uppercase">
                              <Badge
                                variant="outline"
                                fontSize="10"
                                colorScheme={`${
                                  moment(product.discount.expirationDate).diff(
                                    moment(),
                                    "days"
                                  ) < 0
                                    ? "gray"
                                    : "blue"
                                }`}
                              >
                                {`${
                                  moment(product.discount.expirationDate).diff(
                                    moment(),
                                    "days"
                                  ) < 0
                                    ? "Expired"
                                    : `Expires on ${moment(
                                        product.discount.expirationDate
                                      ).format("ll")}`
                                }`}
                              </Badge>
                            </p>
                          </Th>
                          <Th>
                            <h1 className="uppercase">
                              <Badge
                                variant="outline"
                                fontSize="10"
                                colorScheme={`${
                                  product.enabled ? "blue" : "gray"
                                }`}
                              >
                                {product.enabled ? "Yes" : "No"}
                              </Badge>
                            </h1>
                          </Th>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label="Options"
                                icon={<HiEllipsisVertical size={20} />}
                                variant="outline"
                              ></MenuButton>
                              <MenuList minWidth="150px">
                                <MenuItem icon={<ViewIcon />}>
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<EditIcon />}>
                                  Edit Details
                                </MenuItem>
                                <MenuItem icon={<DeleteIcon />}>
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
                        No orders yet.
                      </Th>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModal}
        onClose={onCloseModal}
        size="lg"
        
      >

        <form onSubmit={handleSubmit(onSubmit)}>
        <ModalOverlay backdropFilter='blur(10px)' />
        <ModalContent rounded="sm">
          <ModalHeader
            bg="gray.200"
            color="gray.700"
            borderTop="4px"
            borderColor="blue.500"
            className="flex items-center justify-between"
          >
            <Text>Add Product</Text>
            <CloseButton rounded="sm" color="gray.700" onClick={onCloseModal} />
          </ModalHeader>

          <ModalBody pb={6}>
            <div className="mt-4">
              <FormControl isInvalid={!!errors.file_} isRequired className="bg-red-1000">
                <FormLabel>{"Select Images"}</FormLabel>

                <FileUpload
                  accept={"image/*"}
                  multiple
                  register={register("file_", { validate: validateFiles })}
                  refElem={selectImageRef}
                  onChangeCallback={handleFileChange}
                >
                <div>
                  <Button 
                    onClick={handleSelectImage} 
                    height={28} 
                    width={28} 
                    bg="white" 
                    _groupHover={{
                      backgroundColor: "#fafafa",
                      borderColor: "#d4d4d8"

                    }}
                    className="bg-white border-4 border-dashed border-zinc-200"
                    >
                      <Icon as={HiOutlinePlusCircle}
                      textColor="#e4e4e7"
                      fontSize={44}
                      _groupHover={{
                        textColor: "#d4d4d8",
                      }}></Icon>
                  </Button>
                </div>

                {files && 
                  <>
                    {Array.from(files).map((file, index) => (

                      <div key={index} className="relative">
                        <Icon 
                          onClick={() => handleRemovePreview(index)}
                          as={HiMiniXMark}
                          textColor="#fafafa"
                          className="absolute right-1 top-1 w-5 h-5 rounded-full bg-gray-400 text-gray-100 shadow-md"
                          _hover={{
                            backgroundColor:"#64748b"
                          }}
                          >
                            
                          </Icon>
                          <img
                            className="h-28 w-28 object-cover shadow-md rounded-md outline outline-zinc-100"
                            src={imagePreviews[index]}
                            alt={`Preview ${index}`}
                          />
                      </div>
                    ))}
                  </>
                 }
                
                </FileUpload>

                <FormErrorMessage>
                  {errors.file_ && errors?.file_.message}
                </FormErrorMessage>
              </FormControl>
            </div>

            <div className="mt-4">

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
    </>
  );
};

export default AdminProductsPage;
