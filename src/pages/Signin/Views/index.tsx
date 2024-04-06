import { Link } from "react-router-dom";
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
  Text,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useLogic } from "./logic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const SignIn = () => {
  const [show, setShow] = useState(false); // Show password variables
  const handleClick = () => setShow(!show); // onClick Show Password Event

  const ref1 = useRef<HTMLDivElement>(null); // reference to smoothed element
  const isVisible1 = useIsVisible(ref1); // is visible smooth element

  const {
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
  } = useLogic();

  return (
    <section
      ref={ref1}
      className={`transition-opacity ease-in duration-500 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      } overflow-hidden`}
    >
      <div className="grid grid-cols-2">
        <div className="bg-white col-span-full rounded-l-lg rounded-r-lg lg:col-span-1 lg:rounded-r-none px-4 relative z-30">
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 md:px-0 flex flex-col form-container w-full max-w-sm mb-12"
            >
              <h1 className="text-2xl text-center font-semibold text-gray-700">
                Sign In to your account
              </h1>
              <p className="text-sm text-center text-gray-500 mt-2">
                Welcome back!
              </p>

              <div className="mt-4">
                {isOpenAlert ? (
                  <Alert status={alertObj.type}>
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{alertObj.title}</AlertTitle>
                      <AlertDescription>{alertObj.message}</AlertDescription>
                    </Box>
                    <CloseButton
                      alignSelf="flex-start"
                      position="relative"
                      right={-1}
                      top={-1}
                      onClick={onCloseAlert}
                    />
                  </Alert>
                ) : (
                  ""
                )}
              </div>

              {isOpenResendVerification && !isSendingVerification && isOpenAlert ? (
                <div className="flex gap-1 mt-4 items-center justify-center">
                  <h1 className="text-xs text-center font-semibold text-gray-400">
                    Did not receive verification email?{" "}
                  </h1>
                  <h1
                    className="text-xs text-center font-semibold text-blue-600 cursor-pointer"
                    onClick={resendEmail}
                  >
                    Resend
                  </h1>
                </div>
              ) : isSendingVerification ? (
                <div className="mt-4">
                  <h1
                    className="text-xs text-center font-semibold text-blue-600 cursor-pointer"
                    onClick={resendEmail}
                  >
                    Sending...
                  </h1>
                </div>
              ) : ""}
              <div className="mt-4">
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="name" fontSize="sm" margin={0}>
                    Email
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    placeholder="Enter email"
                    {...register("email", {
                      required: "Enter your email",
                    })}
                    value={emailValue}
                    onChange={onChange}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-4">
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password" fontSize="sm" margin={0}>
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      fontSize="sm"
                      placeholder="Enter password"
                      type={show ? "text" : "password"}
                      {...register("password", {
                        required: "Enter your password",
                      })}
                      value={passwordValue}
                      onChange={onChange}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        fontWeight="light"
                        size="xs"
                        onClick={handleClick}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-2 flex justify-between">
                <div>
                  {/* <Checkbox size="sm" 
                        id="persist"
                        onChange={togglePersist}
                        isChecked={persist}>Remember Me</Checkbox> */}
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-sky-600"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  _active={{ bg: "blue.600" }}
                  _hover={{ bg: "blue.600" }}
                  isLoading={isSubmitting}
                  bg="blue.500"
                  color="white"
                  fontWeight="regular"
                  className="w-full rounded-md"
                >
                  Sign In
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-1 mb-10">
              <Text className="text-sm">Don't have and account?</Text>
              <Link
                to="/signup/option"
                className="text-sm font-semibold text-sky-600"
              >
                Sign Up
              </Link>
            </div>

            <Link
              to={"/"}
              className="text-sm text-blue-300 hover:text-blue-500 transition duration-300 ease-out"
            >
              Back to Home Page
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

export default SignIn;
