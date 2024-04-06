import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../../../../api/axios";
import { PetInfo } from "../../../../../flux/pets/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDisclosure } from "@chakra-ui/react";

interface AlertResponse {
  status: "loading" | "info" | "warning" | "success" | "error" | undefined;
  title: string;
  message: string;
}

export const useLogic = () => {
  const foo = true;

  const [alertResponse, setAlertResponse] = useState<AlertResponse>({
    status: undefined,
    title: "",
    message: "",
  });

  const {
    isOpen: isOpenGenerateModal,
    onOpen: onOpenGenerateModal,
    onClose: onCloseGenerateModal,
  } = useDisclosure();

  const {
    isOpen: isAlertOpen,
    onClose: onCloseAlert,
    onOpen: onOpenAlert,
  } = useDisclosure({ defaultIsOpen: false });
  return {
    isOpenGenerateModal,
    onOpenGenerateModal,
    onCloseGenerateModal,
    isAlertOpen,
    onCloseAlert,
    onOpenAlert,

    alertResponse
  };
};
