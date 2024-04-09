import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiBadgeCheck } from "react-icons/hi";
import { UserInfoContext } from "../../../../../../flux/user/store";
import { UserInfo } from "../../../../../../flux/user/types";
import { axiosPrivate } from "../../../../../../api/axios";
import { FiLoader } from "react-icons/fi";
import { totp } from "otplib";
import moment, { Moment } from "moment";
import { changeUser, updateUser } from "../../../../../../flux/user/action";
import { useSettings } from "../../../../../../hooks/useSettings";

export type EmailInputs = {
  current_email: string;
  new_email: string;
  otp: string;
};

function isValidEmail(email: string): boolean {
  const isValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  return isValid;
}

function formatEmail(emailString: string): string {
  const splitEmail: string[] = emailString.split("@");
  const domain: string = splitEmail[1];
  const name: string = splitEmail[0];
  return name.substring(0, 3).concat("*********@").concat(domain);
}

function formatPhoneNumber(phoneNumberString: string): string {
  const cleanedPhoneNumber: string = phoneNumberString.replace(/\D/g, ""); // Remove non-numeric characters

  // Ensure that there are at least 5 digits to show (2 at the beginning + 3 at the end)
  if (cleanedPhoneNumber.length < 5) {
    return cleanedPhoneNumber; // Not enough digits to hide
  }

  const firstDigits: string = cleanedPhoneNumber.substring(0, 2);
  const lastDigits: string = cleanedPhoneNumber.substring(
    cleanedPhoneNumber.length - 3
  );

  // Fill the middle with X characters
  const middleDigits: string = "X".repeat(cleanedPhoneNumber.length - 5);

  // You can customize the format as needed
  return `${firstDigits}${middleDigits}${lastDigits}`;
}

function getTimeRemaining(targetDate: Moment) {
  const now = moment.utc();
  const diff = targetDate.diff(now);
  const duration = moment.duration(diff);

  // Set a minimum duration (e.g., 1 second)
  const minDuration = moment.duration(1, "second");
  if (duration.asSeconds() < minDuration.asSeconds()) {
    duration.add(minDuration);
  }

  return {
    minutes: padWithZero(duration.minutes()),
    seconds: padWithZero(duration.seconds()),
  };
}

function padWithZero(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

const AccountSettingsPage = () => {
  const {
    isOpen: isOpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();

  const [targetDate, setTargetDate] = useState(moment.utc());
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(targetDate)
  );

  const [progress, setProgress] = useState(0);
  const [changeEmailStep, setChangeEmailStep] = useState(0);
  const [emailData, setEmailData] = useState<EmailInputs>({
    new_email: "",
    current_email: "",
    otp: "",
  });

  const { userState, userDispatch } = useContext(UserInfoContext);
  const [hasOTP, setHasOTP] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSentOTP, setIsSentOTP] = useState(false);

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
  } = useForm<EmailInputs>();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setEmailData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleReset = () => {
    clearErrors();
    setEmailData({
      new_email: "",
      current_email: "",
      otp: "",
    });
  };

  const handlePhoneChange = () => {
    toast({
      position: "top",
      title: "In Progress",
      description:
        "This feature is currently under development and not yet available at the moment.",
      status: "info",
      isClosable: true,
      duration: 3000,
    });
  };

  const resendOTP = () => {
    if (
      parseInt(timeRemaining.minutes) <= 0 &&
      parseInt(timeRemaining.seconds) <= 0
    ) {
      setIsSentOTP(false);
      setIsSendingEmail(true);
      axiosPrivate
        .post(`/user/send_otp?email=${emailData.new_email}`)
        .then((response) => {
          localStorage.setItem("new_email", emailData.new_email);
          setTargetDate(moment(response.data.date));
          setIsSendingEmail(false);
        })
        .catch((error) => {
          setIsSendingEmail(false);
          toast({
            position: "top",
            title: "Something went wrong",
            description:
              "Unable to send OTP pin to your email address. Please try again later",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
          handleReset();
          setChangeEmailStep(0);
          setProgress(0);
        })
        .finally(() => {
          setIsSendingEmail(false);
        });
    }
  };

  const resetOTP = () => {
    axiosPrivate
      .get(`/user/reset_otp`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  const checkEmail = () => {
    if (changeEmailStep == 0) {
      if (emailData.current_email == userInfo.email) {
        setChangeEmailStep(changeEmailStep + 1);
        setProgress(progress + 33);
      } else {
        setError("current_email", {
          type: "manual",
          message: "Incorrect email address",
        });
      }
    } else if (changeEmailStep == 1) {
      if (emailData.new_email == "") {
        setError("new_email", {
          type: "manual",
          message: "This field is required",
        });
      } else if (!isValidEmail(emailData.new_email)) {
        setError("new_email", {
          type: "manual",
          message: "This is not a valid email address",
        });
      } else if (emailData.new_email == userInfo.email) {
        setError("new_email", {
          type: "manual",
          message: "This email is already the one you're using",
        });
      } else {
        axiosPrivate
          .post(`/user/check/email`, { email: emailData.new_email })
          .then((response) => {
            if (isSentOTP) {
              setIsSendingEmail(false);
              setChangeEmailStep(2);
              setProgress(progress + 33);
            } else if (
              hasOTP &&
              (parseInt(timeRemaining.minutes) > 0 ||
                parseInt(timeRemaining.seconds) > 0)
            ) {
              setTargetDate(moment(userInfo.otp_created_at));
              setIsSendingEmail(false);
              setChangeEmailStep(2);
              setProgress(progress + 33);
            } else {
              setIsSendingEmail(true);
              axiosPrivate
                .post(`/user/send_otp?email=${emailData.new_email}`)
                .then((response) => {
                  localStorage.setItem("new_email", emailData.new_email);
                  setIsSentOTP(true);
                  setTargetDate(moment(response.data.date));
                  setIsSendingEmail(false);
                  setChangeEmailStep(2);
                  setProgress(progress + 33);
                })
                .catch((error) => {
                  setIsSendingEmail(false);
                  toast({
                    position: "top",
                    title: "Something went wrong",
                    description:
                      "Unable to send OTP pin to your email address. Please try again later",
                    status: "error",
                    isClosable: true,
                    duration: 3000,
                  });
                  handleReset();
                  setChangeEmailStep(0);
                  setProgress(0);
                })
                .finally(() => {
                  setIsSendingEmail(false);
                });
            }
          })
          .catch((error) => {
            setError("new_email", {
              type: "manual",
              message: "The email is already in use",
            });
          });
      }
    } else if (changeEmailStep == 2) {
      axiosPrivate
        .post(`/user/verify_otp?otp=${emailData.otp}`)
        .then((response) => {
          if (response.data.isValid) {
            // setChangeEmailStep(changeEmailStep + 1);
            // setProgress(progress + 34);
            axiosPrivate
              .post(`/user/update`, { email: emailData.new_email })
              .then((response) => {
                userDispatch(changeUser(response.data));
                localStorage.setItem("pageData", JSON.stringify(response.data));
                // handleReset();
                // clearErrors();
                setProgress(progress + 34);
                setChangeEmailStep(changeEmailStep + 1);
                setHasOTP(false);
                setIsSentOTP(false);
                localStorage.removeItem("new_email");
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => {});
          } else {
            setError("otp", {
              type: "manual",
              message: "Incorrect OTP Pin. Please try again.",
            });
          }
        })
        .catch((error) => {
          toast({
            position: "top",
            title: "Something went wrong",
            description: "Unable to veify OTP pin. Please try again later",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        })
        .finally(() => {});
    } else {
    }
  };



  const [settings, updateSettings] = useSettings();

  const saveSettingsChanges = async () => {
    axiosPrivate.post(`/user/update-settings`, settings)
    .then((response) => {
      if(response.data){
        userDispatch(updateUser(response.data))
      }
    })
    .catch((error) => { 
      console.log(error); 
    });
  }

  const handleToggleContactVisibility = () => {
    const updatedSettings = { ...settings };
    updatedSettings.account.privacy.contact.visible = !settings.account.privacy.contact.visible;
    updateSettings(updatedSettings);
    saveSettingsChanges()
  };

  const handleTogglePrivacySetting = (settingName: 'allergies' | 'medications' | 'vaccinations') => {
    const updatedSettings = { ...settings };
    // Toggle the specified privacy setting
    updatedSettings.account.privacy.medical[settingName] = !updatedSettings.account.privacy.medical[settingName];
    updateSettings(updatedSettings);
    saveSettingsChanges()
    
};

  const CurrentEmailComponent = () => {
    return (
      <>
        <h1 className="font-bold text-gray-700 mb-8 mt-2">
          {formatEmail(userInfo.email)}
        </h1>
        <FormControl isInvalid={!!errors.current_email}>
          <Controller
            name="current_email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Complete your email address"
                type="email"
                fontSize="sm"
                size="md"
                value={emailData.current_email || ""}
                onChange={(e) => {
                  clearErrors("current_email");
                  field.onChange(e);
                  onChangeInput(e);
                }}
              />
            )}
          />
          <FormErrorMessage fontSize="xs">
            {errors.current_email && errors.current_email.message}
          </FormErrorMessage>
        </FormControl>
      </>
    );
  };

  const NewEmailComponent = () => {
    return (
      <>
        <FormControl isInvalid={!!errors.new_email}>
          <FormLabel fontSize="sm" color="gray.900">
            New Email <span className="text-red-500 text-base">*</span>
          </FormLabel>
          <Controller
            name="new_email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your new email address"
                type="email"
                fontSize="sm"
                size="md"
                value={emailData.new_email || ""}
                onChange={(e) => {
                  clearErrors("new_email");
                  field.onChange(e);
                  onChangeInput(e);
                }}
              />
            )}
          />
          <FormErrorMessage fontSize="xs">
            {errors.new_email && errors.new_email.message}
          </FormErrorMessage>
        </FormControl>
      </>
    );
  };
  const OTPComponent = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-gray-700 font-semibold text-lg">
            Email Verification
          </h1>
          <p className="text-gray-600 text-sm text-center">
            Check your Email. We have sent you the Code at{" "}
            <span className="font-semibold">{emailData.new_email}</span>
          </p>

          {
            <>
              <div
                className={`mt-6 mb-4 ${
                  isNaN(parseInt(timeRemaining.minutes)) ||
                  (parseInt(timeRemaining.minutes) <= 0 &&
                    parseInt(timeRemaining.seconds) <= 1)
                    ? "hidden"
                    : "block"
                }`}
              >
                <p className="text-sm text-gray-400">Resend in </p>
                <div className="flex flex-row justify-center items-center">
                  <p className="text-xl font-light text-gray-600">
                    {`${timeRemaining.minutes}`} : {`${timeRemaining.seconds}`}
                  </p>
                </div>
              </div>
              <p
                onClick={resendOTP}
                className={`text-sm text-blue-500 mt-6 cursor-pointer ${
                  isNaN(parseInt(timeRemaining.minutes)) ||
                  (parseInt(timeRemaining.minutes) <= 0 &&
                    parseInt(timeRemaining.seconds) <= 0)
                    ? "block"
                    : "hidden"
                }`}
              >
                Resend Code
              </p>
            </>
          }
        </div>
        <HStack>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.otp}>
                <VStack>
                  <HStack className="flex flex-row justify-center items-start">
                    <PinInput
                      size="lg"
                      otp
                      onChange={(e) => {
                        setEmailData((prevData) => ({
                          ...prevData,
                          otp: e,
                        }));
                      }}
                    >
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                      <PinInputField
                        onChange={(e) => {
                          if (e.target.value) {
                            e.target.blur();
                          }
                        }}
                      />
                    </PinInput>
                  </HStack>
                  <FormErrorMessage fontSize="xs">
                    {errors.otp && errors.otp.message}
                  </FormErrorMessage>
                </VStack>
              </FormControl>
            )}
          />
        </HStack>
      </>
    );
  };

  const SuccessComponent = () => {
    return (
      <>
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className="text-gray-700 font-bold text-2xl">
            Email Updated Successfully
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Your account now reflects the updated email address.
          </p>
        </div>
      </>
    );
  };

  const ModalBodyContent = [
    CurrentEmailComponent(),
    NewEmailComponent(),
    OTPComponent(),
    SuccessComponent(),
  ];

  useEffect(() => {
    setUserInfo(userState.userInfo);
    setTargetDate(moment(userState.userInfo.otp_created_at));

    const rem = getTimeRemaining(moment(userState.userInfo.otp_created_at));

    if (progress < 100 && changeEmailStep < 3) {
      if (
        isNaN(parseInt(rem.minutes)) ||
        (parseInt(rem.minutes) <= 0 && parseInt(rem.seconds) <= 0)
      ) {
        setProgress(0);
        setChangeEmailStep(0);
        handleReset();
        clearErrors();
      } else {
        const new_email = localStorage.getItem("new_email");
        setChangeEmailStep(2);
        setProgress(66);
        setEmailData({
          current_email: userInfo.email,
          new_email: `${new_email}`,
          otp: emailData.otp,
        });
      }
    }
  }, [userState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        const remainingTime = getTimeRemaining(targetDate);

        if (
          parseInt(remainingTime.minutes) <= 0 &&
          parseInt(remainingTime.seconds) <= 0
        ) {
          clearInterval(interval);
          setTimeRemaining({ minutes: "0", seconds: "0" });
        }

        return remainingTime;
      });
    }, 1000);

    const { minutes, seconds } = getTimeRemaining(
      moment(userState.userInfo.otp_created_at)
    );
    if (parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
      setTimeRemaining({ minutes: "0", seconds: "0" });
    }
    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [targetDate, changeEmailStep]);

  return (
    <div className="bg-red-0 py-3 px-2">
      <h1 className="text-xl font-bold text-gray-700">Account Settings</h1>
      <p className="text-sm text-gray-400">
        Change your email, phone, and other account settings
      </p>
      {/* <Divider className="my-4"></Divider> */}
      <div className="grid grid-cols-12 mt-8">
        <div className="col-span-12 lg:col-span-6 bg-blue-1000">
          <h1 className="text-gray-700 font-semibold text-base">
            Change Email Address
          </h1>
          <p className="text-gray-400 text-sm">
            Note: Your Email Address Serves as Your Sign-in Identifier
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-red-1000 mt-4 lg:mt-0">
          <div className="flex flex-col ">
            <div className="mb-2 flex md:flex-row flex-col justify-between">
              <div className="">
                <h1 className="text-gray-700 font-semibold text-base">Email Address</h1>
                <p className=" my-1 text-sm">{formatEmail(userInfo?.email)}</p>
                <div className="flex flex-row bg-sky-100 text-sky-500 px-3 py-1 rounded-full w-fit">
                  <HiBadgeCheck />
                  <span className="text-xs font-bold"> VERIFIED</span>
                </div>
              </div>
              <div className="flex justify-center items-center pr-2 mt-4 md:mt-0">
                <button
                  onClick={onOpenModal1}
                  className="py-2 px-4 w-full text-white bg-blue-500 text-sm rounded-md shadow-md"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className='my-4 mt-8'></Divider>
      <h1 className="text-xl font-bold text-gray-700">Privacy Settings</h1>
      <p className="text-sm text-gray-400">
        Change your email, phone, and other account settings
      </p>
      {/* <Divider className='my-4'></Divider> */}
        <div className="flex justify-between items-center gap-4 mt-6">
            <div className="">
              <h1 className="text-gray-700 font-semibold text-base">
              Contact Information
              </h1>
              <p className="text-sm text-gray-400">
              This includes contact profiles, such as phone numbers and emails. It's recommended to keep this setting turned on.
              </p>
            </div>
            <div className="">
              <FormControl display='flex' height="100%" justifyContent="end" alignItems='center'>
                  <Switch id='news_and_updates' isChecked={settings.account.privacy.contact.visible} size="lg" onChange={handleToggleContactVisibility}/>
              </FormControl>
            </div>
        </div>


      {/* <Divider className='my-4'></Divider> */}
        <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 lg:col-span-6 bg-blue-1000">
            <h1 className="text-gray-700 font-semibold text-base">
            Medical Information
            </h1>
            <p className="text-gray-400 text-sm">
            This includes all health information of your pet.
            </p>
            </div>
            <div className="col-span-12 lg:col-span-6 bg-red-1000 mt-2 lg:mt-0">
                    <div className="flex flex-col ">
                        <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                <h1 className='text-gray-700 font-semibold'>
                                    Allergies
                                </h1>
                                <p className='text-sm text-gray-400'>
                                Toggle on to share your pet's allergy information with others.
                                </p>
                                </div>
                                <Switch id='pet_monitoring' size="lg" isChecked={settings.account.privacy.medical.allergies} onChange={()=>{
                                  handleTogglePrivacySetting('allergies')
                                }}/>
                            </FormControl>
                        </div>
                        <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                    <h1 className='text-gray-700 font-semibold'>
                                        Medications
                                    </h1>
                                    <p className='text-sm text-gray-400'>
                                    Toggle on to share updates about your pet's medication status.
                                    </p>
                                </div>
                                <Switch id='news_and_updates' size="lg" isChecked={settings.account.privacy.medical.medications} onChange={()=>{
                                  handleTogglePrivacySetting('medications')
                                }}/>
                            </FormControl>
                        </div>

                        <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                    <h1 className='text-gray-700 font-semibold'>
                                        Vaccinations
                                    </h1>
                                    <p className='text-sm text-gray-400'>
                                    Toggle on to share your pet's vaccination records with others.
                                      </p>
                                </div>
                                <Switch id='news_and_updates' size="lg" isChecked={settings.account.privacy.medical.vaccinations} onChange={()=>{
                                  handleTogglePrivacySetting('vaccinations')
                                }}/>
                            </FormControl>
                        </div>
                        {/* <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                    <h1 className='text-gray-700 font-semibold'>
                                        User Research
                                    </h1>
                                    <p className='text-sm text-gray-400'>Get involved in our beta testing program or participate in paid product user research.</p>
                                </div>
                                <Switch id='email-alerts' size="lg"/>
                            </FormControl>
                        </div> */}
                    </div>
            </div>
        </div>

      {/* <Divider className="py-3"></Divider>

      <div className="grid grid-cols-12 mt-8">
        <div className="col-span-12 lg:col-span-6 bg-blue-1000">
          <h1 className="text-gray-700 font-semibold text-lg">
            Change Phone Number
          </h1>
          <p className="text-gray-400 text-sm">
            Note: Your phone number can be use in sending OTP code.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-red-1000 mt-4 lg:mt-0">
          <div className="flex flex-col ">
            <div className="mb-2 flex md:flex-row flex-col justify-between">
              <div className="">
                <h1 className="text-gray-700 font-semibold">Phone Number</h1>
                <p className=" my-1">
                  {formatPhoneNumber(userInfo?.phone_number)}
                </p>
                <div className="flex flex-row bg-gray-100 text-gray-500 px-3 py-1 rounded-full w-fit">
                  <span className=" text-xs font-bold">NOT VERIFIED</span>
                </div>
              </div>
              <div className="flex justify-center items-center pr-2 mt-4 md:mt-0">
                <button
                  onClick={handlePhoneChange}
                  className="py-2 px-4 w-full text-white bg-blue-500 text-sm rounded-md shadow-md"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModal1}
        onClose={onCloseModal1}
      >
        <ModalOverlay />
        <ModalContent>
          <Progress value={progress} size="xs" colorScheme="blue" />
          <ModalHeader className="text-gray-700 mt-2 mb-4"></ModalHeader>
          <ModalCloseButton
            display={`${changeEmailStep >= 3 ? "none" : "block"}`}
          />
          <ModalBody pb={6}>{ModalBodyContent[changeEmailStep]}</ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isSendingEmail}
              display={`${
                changeEmailStep == 0 || changeEmailStep == 2 ? "block" : "none"
              }`}
              onClick={() => {
                handleReset();
                clearErrors();
                setChangeEmailStep(0);
                setProgress(0);
                onCloseModal1();
                resetOTP();
              }}
            >
              Cancel
            </Button>
            <Button
              isDisabled={isSendingEmail}
              display={`${
                changeEmailStep > 0 && changeEmailStep < 2 ? "block" : "none"
              }`}
              onClick={() => {
                clearErrors();
                setChangeEmailStep(changeEmailStep - 1);
                setProgress(progress - (changeEmailStep < 2 ? 33 : 34));
              }}
            >
              Back
            </Button>
            <Button
              isDisabled={isSendingEmail}
              isLoading={isSendingEmail}
              loadingText="Sending Email"
              display={`${
                changeEmailStep >= 0 && changeEmailStep < 3 ? "block" : "none"
              }`}
              onClick={checkEmail}
              colorScheme="blue"
              ml={3}
            >
              {`${changeEmailStep == 2 ? "Submit" : "Next"}`}
            </Button>
            <Button
              display={`${changeEmailStep == 3 ? "block" : "none"}`}
              colorScheme="blue"
              ml={3}
              onClick={() => {
                setProgress(0);
                setChangeEmailStep(0);
                handleReset();
                onCloseModal1();
              }}
            >
              {" "}
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AccountSettingsPage;
