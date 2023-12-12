import { ChevronLeftIcon, DownloadIcon, ViewIcon } from "@chakra-ui/icons";
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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
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

const AdminUsersPage = () => {
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
                                <MenuItem icon={<ViewIcon />}>
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
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsersPage;
