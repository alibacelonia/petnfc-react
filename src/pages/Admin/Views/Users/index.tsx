import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, ViewIcon } from "@chakra-ui/icons";
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { HiCheckBadge, HiEllipsisVertical } from "react-icons/hi2";
import { useLogic } from "./logic";
import { PageInfoContext } from "../../../../flux/navigation/store";
import { changePage } from "../../../../flux/navigation/action";

const AdminUsersPage = () => {

  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
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
  } = useLogic();

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

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Users
          </h1>
        </div>
        <div className="relative mt-5">
          <div className="bg-white">
            <TableContainer>
              <Table size="sm">
                <Thead height={10}>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Contact</Th>
                    <Th>Date Registered</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userData.length > 0 ? (
                    userData.map((data, index) => {
                      return (
                        <Tr key={data.id}>
                          <Td>{`${data.firstname} ${data.lastname}`}</Td>
                          <Td>
                              <div className="flex flex-col justify-start items-start">
                                {`${data.email}`}
                                {data.verified ? (
                                    <Badge variant="solid" colorScheme="blue" fontSize='10px' display="inline-flex" alignItems="center">
                                    <HiCheckBadge style={{marginRight: 2}}/> Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="solid" fontSize='10px'> Not Verified</Badge>
                                )}
                              </div>
                          </Td>
                          <Td>{`${data.phone_number}`}</Td>
                          <Td>{`${moment(data.created_at).format("LL")}`}</Td>
                          <Td>
                            {data.status == "active" ? (
                              <Badge variant="outline" colorScheme="blue">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" colorScheme="red">
                                Deactivated
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
                                <MenuItem icon={<ViewIcon />} onClick={() => {
                                  console.log("user_data: ", data);
                                  pageDispatch(changePage('admin_users_details', data))
                                }}>
                                  View Details
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
                        No Users yet.
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
    </>
  );
};

export default AdminUsersPage;
