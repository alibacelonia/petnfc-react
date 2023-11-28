import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// import { useAuth } from "../../../Provider/authProvider";
import { useLocation, useNavigate } from "react-router-dom";
import {axiosPrivate} from '../../../api/axios'
// import { toast } from "react-toastify";
import {useToast} from '@chakra-ui/react'

import useAuth from "../../../hooks/useAuth";

export type Inputs = {
    email: string;
    password: string;
}

export const useLogic = () => {

    const toast = useToast();
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const [dbError, setError] = useState("");

    const [emailValue, setUsername] = useState("")
    const [passwordValue, setPassword] = useState("")

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const element = e.target as HTMLInputElement
        switch (element.name) {
            case "email":
                setUsername(element.value);
                break;
            case "password":
                setPassword(element.value);
                break
            default:
                break
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist])

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
      } = useForm<Inputs>()
    
      const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
            const { email, password } = inputs

            const loginData = {email: emailValue, password: passwordValue}

            try {
                const response = await axiosPrivate
                    .post("/auth/login", loginData)

                const accessToken = response?.data?.access_token;
                const roles = response?.data?.roles;

                setAuth({ emailValue, passwordValue, roles, accessToken });
                setUsername('');
                setPassword('');
                navigate(from, { replace: true });
            }
            catch (error: any) {

                let errorMessage = ""
                let errorTitle = ""
                switch (error.code) {
                    case "ERR_NETWORK":
                        errorTitle = error.message
                        errorMessage = "No response from server."
                        break;
                    case "ERR_BAD_REQUEST":
                        if(error.response.status === 400){
                            errorTitle = "Authentication failed"
                            errorMessage = error.response?.data?.detail
                        }
                        else if(error.response.status === 401){
                            errorTitle = "Authentication failed"
                            errorMessage = error.response?.data?.detail
                        }
                        else if(error.response.status === 422){
                            errorTitle = "Authentication failed"
                            errorMessage = "Incorrect Email or Password";
                        }
                        break;
                    default:
                        errorMessage = "error loging in"
                        
                }
                toast({
                    position:"bottom",
                    title: `${errorTitle}`,
                    description: `${errorMessage}`,
                    status: "error",
                    isClosable: true,
                    duration: 2500
                  })

            }
        
        }

    return { handleSubmit, onSubmit, register, errors, isSubmitting, onChange, emailValue, passwordValue, dbError, persist, togglePersist}
}