import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiBadgeCheck } from "react-icons/hi";
import { axiosPrivate } from "../../../../../../api/axios";
import { UserInfoContext } from "../../../../../../flux/user/store";
import { UserInfo } from "../../../../../../flux/user/types";

export type Inputs = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

function obscureEmail(email: string) {
  // Split the email address into local part and domain
  const [localPart, domain] = email.split("@");

  // Obscure the local part by replacing characters with asterisks
  const obscuredLocalPart =
    localPart.substring(0, 4) +
    "*".repeat(localPart.length - 8) +
    localPart.slice(-4);

  // Construct the obscured email address
  const obscuredEmail = `${obscuredLocalPart}@${domain}`;

  return obscuredEmail;
}

function formatEmail(emailString: string): string {
  const splitEmail: string[] = emailString.split("@");
  const domain: string = splitEmail[1];
  const name: string = splitEmail[0];
  return name.substring(0, 3).concat("*********@").concat(domain);
}

const SecuritySettingsPage = () => {
  const { userState, userDispatch } = useContext(UserInfoContext);

  const pd = userState.userInfo;
  const [userInfo, setUserInfo] = useState<UserInfo>(pd);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const [formdata, setFormData] = useState<Inputs>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const validatePasswords = () => {
    clearErrors();
    const fields = ["current_password", "new_password", "confirm_password"];
    let error_count = 0;

    for (let i of fields) {
      if ((formdata as any)[i] == "") {
        setError(i as any, {
          type: "manual",
          message: "This is a required field.",
        });
        error_count += 1;
      } else if ((formdata as any)[i].length < 8) {
        setError(i as any, {
          type: "manual",
          message: "Minimum password length is 8 characters.",
        });
        error_count += 1;
      }
    }

    if (error_count == 0) {
      axiosPrivate
        .post(`/auth/change_password`, formdata)
        .then((response) => {
          handleReset();
          toast({
            position: "top",
            title: "Password Changed Successfully",
            description: "Remember to keep your credentials secure and safe.",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error(error);
          if (error.response.data.detail == "Incorrect Password") {
            setError("current_password", {
              type: "manual",
              message: "Incorrect Password.",
            });
          }
          if (error.response.data.detail == "Passwords do not match") {
            setError("confirm_password", {
              type: "manual",
              message: "Passwords do not match.",
            });
          }
        });
    }
    return;
  };

  const handleReset = () => {
    clearErrors();
    // Reset the form data state
    setFormData({
      confirm_password: "",
      new_password: "",
      current_password: "",
      // Reset other fields as needed
    });
  };

  const [showCurrent, setCurrent] = useState(false); // Show password variables
  const [showNew, setNew] = useState(false); // Show password variables
  const [showConfirm, setConfirm] = useState(false); // Show password variables


  return (
    <div className="bg-red-0 py-3 px-2">
      <h1 className="text-xl font-bold text-gray-700">Security settings</h1>
      <p className="text-sm text-gray-400">
        Safeguard Your Account with These Key Measures.
      </p>
      <Divider className="my-4"></Divider>
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-6 bg-blue-1000">
          <h1 className="text-gray-700 font-semibold text-lg">
            Update Your Password
          </h1>
          <p className="text-gray-400 text-sm">
            Enhance your security by regularly changing your password
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-red-1000 mt-4 lg:mt-0">
          <form>
            <div className="flex flex-col ">
              <div className="mb-2">
                <FormControl isInvalid={!!errors.current_password}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Current Password{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="current_password"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <Input
                          {...field}
                          placeholder="Enter your current password"
                          type={showCurrent ? "text" : "password"}
                          fontSize="sm"
                          size="md"
                          value={formdata.current_password || ""}
                          onChange={(e) => {
                            clearErrors("current_password");
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            fontWeight="light"
                            size="xs"
                            onClick={() => setCurrent(!showCurrent)}
                          >
                            {showCurrent ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.current_password && errors.current_password.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mb-2">
                <FormControl isInvalid={!!errors.new_password}>
                  <FormLabel fontSize="sm" color="gray.900">
                    New Password{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="new_password"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <Input
                          {...field}
                          placeholder="Enter your new password"
                          type={showNew ? "text" : "password"}
                          fontSize="sm"
                          size="md"
                          value={formdata.new_password || ""}
                          onChange={(e) => {
                            clearErrors("new_password");
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            fontWeight="light"
                            size="xs"
                            onClick={() => setNew(!showNew)}
                          >
                            {showNew ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.new_password && errors.new_password.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mb-2">
                <FormControl isInvalid={!!errors.confirm_password}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Confirm Password{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="confirm_password"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <Input
                          {...field}
                          placeholder="Enter your confirm password"
                          type={showConfirm ? "text" : "password"}
                          fontSize="sm"
                          size="md"
                          value={formdata.confirm_password || ""}
                          onChange={(e) => {
                            clearErrors("confirm_password");
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            fontWeight="light"
                            size="xs"
                            onClick={() => setConfirm(!showConfirm)}
                          >
                            {showConfirm ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.confirm_password && errors.confirm_password.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mb-2 flex flex-row justify-end items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-300 px-6 py-2 text-sm rounded-md"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={validatePasswords}
                  className="bg-blue-500 px-6 py-2 text-sm text-white rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Divider className="py-3"></Divider>
      <div className="grid grid-cols-12 mt-8">
        <div className="col-span-12 lg:col-span-6 bg-blue-1000">
          <h1 className="text-gray-700 font-semibold text-lg">
            Enable Two-Factor Authentication (2FA)
          </h1>
          <p className="text-gray-400 text-sm">
            Strengthen your account security by enabling Two-Factor
            Authentication.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-red-1000 mt-4 lg:mt-0">
          <div className="flex flex-col ">
            <h1 className="text-gray-700 font-semibold">
              How do you want to receive your 2FA code?
            </h1>
            <div className="my-2">
              <RadioGroup defaultValue="email">
                <Stack>
                  <Radio value="email">Email</Radio>
                  <Radio value="text" isDisabled>
                    Text Message
                  </Radio>
                </Stack>
              </RadioGroup>
            </div>
            <div className="mb-2 flex flex-row justify-between">
              <div className="">
                <h1 className="text-gray-700 font-semibold">Email Address</h1>
                <p>{formatEmail(userInfo?.email)}</p>
                <div className="flex flex-row bg-sky-100 text-sky-500 px-3 py-1 rounded-full w-fit">
                  <HiBadgeCheck />
                  <span className=" text-xs font-bold"> VERIFIED</span>
                </div>
              </div>
              {/* <div className="flex justify-center items-center pr-2">
                <Switch colorScheme="blue" size="lg" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
