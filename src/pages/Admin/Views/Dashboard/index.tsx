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
import { HiEllipsisVertical } from "react-icons/hi2";

const AdminDashboardPage = () => {
  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Dashboard
          </h1>
        </div>
        <div className="relative mt-5">
          <div className="bg-white">
            <Alert status="info">
            <AlertIcon />
                This page is currently under development. We apologize for any inconvenience.
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
