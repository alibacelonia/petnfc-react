import { Link, useParams } from "react-router-dom";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Checkbox,
  Alert,
  AlertIcon,
  Text,
  CloseButton,
  AlertTitle,
  Box,
  AlertDescription,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios, { axiosPrivate } from "../../../api/axios";

export type Inputs = {
  new_password: string;
  confirm_password: string;
};

interface AlertResponse {
  status: "loading" | "info" | "warning" | "success" | "error" | undefined;
  title: string;
  message: string;
}

export function useIsVisible(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

const ChangePasswordPage = () => {
  const { token } = useParams<{ token: string }>();

  const [show, setShow] = useState(false); // Show password variables

  const [isShownPassword, setShowPassword] = useState(false); // Show password variables
  const showPassword = () => setShowPassword(!isShownPassword);
  const [isShownPassword2, setShowPassword2] = useState(false); // Show password variables
  const showPassword2 = () => setShowPassword2(!isShownPassword2);

  const handleClick = () => setShow(!show); // onClick Show Password Event

  const ref1 = useRef<HTMLDivElement>(null); // reference to smoothed element
  const isVisible1 = useIsVisible(ref1); // is visible smooth element

  const [alertResponse, setAlertResponse] = useState<AlertResponse>({
    status: undefined,
    title: "",
    message: "",
  });
  const [emailValue, setUsername] = useState("");

  const [formdata, setFormData] = useState<Inputs>({
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

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false });

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    const { new_password, confirm_password } = inputs;

    const formData = new FormData();
    formData.append("new_password", new_password);

    await axios
      .post(`/user/reset-password/${token}`, formData)
      .then((response) => {
        setAlertResponse({
          status: "success",
          title: "Password Changed Successfully!",
          message: "You've updated your password. Keep your account secure by changing it regularly.",
        });
        onOpen();
        setFormData({
            new_password: "",
            confirm_password: "",
          });
      })
      .catch((error) => {
        switch (error.code) {
          case "ERR_NETWORK":
            onOpen();
            setAlertResponse({
              status: "error",
              title: error.response.statusText,
              message: "No response from server.",
            });
            break;
          case "ERR_BAD_REQUEST":
            if (error.response.status === 400) {
              setAlertResponse({
                status: "error",
                title: error.response.statusText,
                message: error.response?.data?.detail,
              });
            } else {
              setAlertResponse({
                status: "error",
                title: error.response.statusText,
                message: error.response?.data?.detail,
              });
            }
            break;
          default:
            setAlertResponse({
              status: "error",
              title: error.response.statusText,
              message: error.response?.data?.detail,
            });
        }
        onOpen();
      });
  };

  const validateLoginDetails = async () => {
    const fields = ['new_password', 'confirm_password'];
    let error_count = 0
    for(let i of fields){
      if((formdata as any)[i] == ""){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1
      }
      else if(formdata.new_password.length < 8){
        error_count += 1
        setError("new_password", { type: "manual", message: "Password must be at least 8 characters long."})
      }
      else if(formdata.new_password != formdata.confirm_password){
        error_count += 1
        setError("confirm_password", { type: "manual", message: "Passwords do not match. Please ensure both passwords are identical."})
      }
    }
    if(error_count > 0) {return;}
    handleSubmit(onSubmit)().then(() => {
      
    });
  }

  useEffect(() => {
    // console.info("alert response: ", alertResponse);
  }, [alertResponse]);

  return (
    <section
      ref={ref1}
      className={`transition-opacity ease-in duration-500 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      } overflow-hidden`}
    >
      <div className="grid grid-cols-2">
        <div className="bg-white col-span-full rounded-l-lg rounded-r-lg lg:col-span-1 lg:rounded-r-none px-4 relative z-50">
          <div className="flex flex-col min-h-screen justify-center items-center">
            <div className="flex items-center justify-center w-full max-w-sm mb-4">
              <Image
                src="/logo/logo-blue.png"
                width={75}
                height={75}
                alt="Picture of the author"
              />
              <h1 className="font-semibold text-[#0E67B5] text-2xl">PetNFC</h1>
            </div>
            <form className="px-6 md:px-0 flex flex-col form-container w-full max-w-sm mb-20"
            >
              <h1 className="text-2xl text-center font-semibold text-gray-700">
                Change Password
              </h1>
              <p className="text-sm text-center text-gray-500 mt-2">
                Secure your account by updating your password
              </p>
              <div className="flex items-center justify-center mt-4">
                <Alert
                  status={alertResponse.status}
                  display={isVisible ? "flex" : "none"}
                  alignItems="center"
                  justifyContent="start"
                >
                  <AlertIcon width={4} />
                  <Box flexGrow={1}>
                    <AlertTitle className="text-sm">
                      {alertResponse.title}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {alertResponse.message}
                    </AlertDescription>
                  </Box>
                  <CloseButton
                    alignSelf="flex-start"
                    position="relative"
                    right={-1}
                    top={-1}
                    onClick={onClose}
                  />
                </Alert>
              </div>

              <div className="mt-4">
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
                          type={isShownPassword ? "text" : "password"}
                          fontSize="sm"
                          size="lg"
                          value={formdata.new_password || ""}
                          onChange={(e) => {
                            if (e.target.value == "") {
                              setError("new_password", {
                                type: "manual",
                                message: "This is a required field.",
                              });
                            } else {
                              clearErrors("new_password");
                            }
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />

                        <InputRightElement width="4.5rem" height="100%">
                          <Button
                            h="1.75rem"
                            fontWeight="light"
                            size="xs"
                            onClick={showPassword}
                          >
                            {isShownPassword ? "Hide" : "Show"}
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

              <div className="mt-4">
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
                          type={isShownPassword2 ? "text" : "password"}
                          fontSize="sm"
                          size="lg"
                          value={formdata.confirm_password || ""}
                          onChange={(e) => {
                            if (e.target.value == "") {
                              setError("confirm_password", {
                                type: "manual",
                                message: "This is a required field.",
                              });
                            } else {
                              clearErrors("confirm_password");
                            }
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />

                        <InputRightElement width="4.5rem" height="100%">
                          <Button
                            h="1.75rem"
                            fontWeight="light"
                            size="xs"
                            onClick={showPassword2}
                          >
                            {isShownPassword2 ? "Hide" : "Show"}
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

              <div className="mt-4">
                <Button
                  type="button"
                  onClick={validateLoginDetails}
                  _active={{ bg: "blue.600" }}
                  _hover={{ bg: "blue.600" }}
                  isLoading={isSubmitting}
                  bg="blue.500"
                  color="white"
                  fontWeight="regular"
                  className="w-full rounded-md"
                >
                  Change Password
                </Button>
              </div>
            </form>
            <Link
              to={"/signin"}
              className="text-sm text-blue-300 hover:text-blue-500 transition duration-300 ease-out"
            >
              Back to Sign In Page
            </Link>
          </div>
        </div>
        <div
          className={`bg-gradient-to-r from-blue-400 to-blue-600 hidden lg:block rounded-r-lg relative z-40`}
        >
          <div className="bg-blue-500 w-24 h-24 rounded-full absolute right-56 top-12"></div>
          <div className="bg-blue-500 w-4 h-4 rounded-full absolute right-56 top-12"></div>

          <div className="bg-blue-500 w-36 h-36 rounded-full absolute right-96 bottom-32"></div>
          <div className="bg-blue-500 w-8 h-8 rounded-full absolute right-56 bottom-12"></div>

          <div className="flex flex-col items-center justify-center min-h-screen relative">
            <div className="bg-blue-500 w-20 h-20 rounded-full absolute left-24 top-48"></div>
            <div className="bg-blue-500 w-12 h-12 rounded-full absolute left-40 top-12"></div>

            <div className="bg-blue-600 w-24 h-24 rounded-full absolute right-24 bottom-48"></div>
            <div className="bg-blue-600 w-8 h-8 rounded-full absolute right-24 top-56"></div>
            <Image
              width={220}
              className="z-50"
              src="/assets/howitworks/Step-03.png"
              alt="Picture of the author"
            />
            <h1 className="text-slate-100 font-semibold text-lg mt-4 z-50">
              QR and NFC Tagging
            </h1>
            <p className="max-w-md text-slate-100 z-50">
              With a simple scan or tap, unlock a world of information,
              convenience, and possibilities for your pet’s data.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ChangePasswordPage;
