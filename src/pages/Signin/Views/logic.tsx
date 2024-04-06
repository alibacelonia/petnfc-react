import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// import { useAuth } from "../../../Provider/authProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { axiosPrivate } from "../../../api/axios";
// import { toast } from "react-toastify";
import { useDisclosure, useToast } from "@chakra-ui/react";

import useAuth from "../../../hooks/useAuth";

export type Inputs = {
  email: string;
  password: string;
};

export type AlertObj = {
    type: "info" | "warning" | "success" | "error" | "loading" | undefined;
    title: string;
    message: string;
  };

export const useLogic = () => {
  const toast = useToast();
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [dbError, setError] = useState("");

  const [emailValue, setUsername] = useState("");
  const [passwordValue, setPassword] = useState("");

  const [persistEmail, setPersistEmail] = useState("");

  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const {
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
    onOpen: onOpenAlert,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertObj, setAlertObj] = useState<AlertObj>({
    type: undefined,
    title: '',
    message: ''
  });

  const [isOpenResendVerification, setIsOpenResendVerification] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.target as HTMLInputElement;
    switch (element.name) {
      case "email":
        setUsername(element.value);
        break;
      case "password":
        setPassword(element.value);
        break;
      default:
        break;
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>();

  const resendEmail = () => {
    setIsSendingVerification(true);
    axios.post('/auth/resend-email-verification', { 'email': persistEmail }, {
        headers: {
            'Content-Type': 'application/json',
        }}).then((response) => {

        setAlertObj({  type: 'success', title: `Success`, message: `${response.data.message}`})
        setIsOpenResendVerification(false)
    }).catch((error)=>{
        setAlertObj({  type: 'error', title: `${error.message}`, message: `${error.response?.data?.detail}`})
    }).finally(() => {
        setIsSendingVerification(false);
    });

  }

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    const { email, password } = inputs;

    const loginData = { email: emailValue, password: passwordValue };

    try {
      const response = await axiosPrivate.post("/auth/login", loginData);

      const accessToken = response?.data?.access_token;
      const role = response?.data?.role;
      // console.log(response?.data);
      setAuth({ emailValue, passwordValue, role, accessToken });
      setUsername("");
      setPassword("");
      navigate(role == "admin" ? "/adminpanel" : "/home", { replace: true });
    } catch (error: any) {
      let errorMessage = "";
      let errorTitle = "";
      switch (error.code) {
        case "ERR_NETWORK":
          errorTitle = error.message;
          errorMessage = "No response from server.";
          break;
        case "ERR_BAD_REQUEST":
          if (error.response.status === 400) {
            errorTitle = "Authentication failed";
            errorMessage = error.response?.data?.detail;
          } else if (error.response.status === 401) {
            setPersistEmail(email)
            setIsOpenResendVerification(true)
            errorTitle = "Account not verified";
            errorMessage = error.response?.data?.detail;

          } else if (error.response.status === 422) {
            errorTitle = "Authentication failed";
            errorMessage = "Incorrect Email or Password";
          }
          break;
        default:
          errorMessage = "error loging in";
      }

      setAlertObj({  type: 'error', title: `${errorTitle}`, message: `${errorMessage}`})
      onOpenAlert();
    //   toast({
    //     position: "bottom",
    //     title: `${errorTitle}`,
    //     description: `${errorMessage}`,
    //     status: "error",
    //     isClosable: true,
    //     duration: 2500,
    //   });
    }
  };
  

  return {
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting,
    onChange,
    emailValue,
    passwordValue,
    dbError,
    persist,
    togglePersist,
    isOpenAlert,
    onCloseAlert,
    onOpenAlert,
    alertObj,
    isOpenResendVerification,
    resendEmail,
    isSendingVerification,
  };
};
