import { Link, useNavigate } from "react-router-dom";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image as ChakraImage,
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
  Modal,
  ModalOverlay,
  ModalContent
} from "@chakra-ui/react";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { axiosPrivate } from "../../../api/axios";
import { HiOutlineFolderOpen, HiOutlineQrCode } from "react-icons/hi2";
import { QrScanner } from "@yudiel/react-qr-scanner";
import jsQR, { QRCode } from "jsqr";

const validateQR = (text: string): boolean => {
  const pattern =
    /^https:\/\/secure-petz\.info\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return pattern.test(text);
};


export type Inputs = {
    email: string;
}

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

const SignUpOptionPage = () => {

  const navigate = useNavigate();

  const [show, setShow] = useState(false); // Show password variables
  const handleClick = () => setShow(!show); // onClick Show Password Event

  const ref1 = useRef<HTMLDivElement>(null); // reference to smoothed element
  const isVisible1 = useIsVisible(ref1); // is visible smooth element

  const [alertResponse, setAlertResponse] = useState<AlertResponse>({ status: undefined, title: "", message: "" });
  const [emailValue, setUsername] = useState("")


  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>()

  const {
    isOpen: isVisible,
    onClose: onCloseAlert,
    onOpen: onOpenAlert,
  } = useDisclosure({ defaultIsOpen: false })


  const {
    isOpen: isOpenModal,
    onClose: onCloseModal,
    onOpen: onOpenModal,
  } = useDisclosure({ defaultIsOpen: false })
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const element = e.target as HTMLInputElement
        switch (element.name) {
            case "email":
                setUsername(element.value);
                break;
            default:
                break
        }
    }

    const decodeQRCode = (imageData: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as CanvasRenderingContext2D; // Type assertion here
  
      const img = new Image();
      img.src = imageData;
  
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
  
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code: QRCode | null =
          imageData && jsQR(imageData.data, imageData.width, imageData.height);
  
        if (code) {
          validate(code.data);
        } else {
          setAlertResponse({ status : "error", title: "No QR Code Recognized", message: "The provided image does not contain a valid QR Code. Please upload a valid QR Code image."});
          onOpenAlert();
        }
      };
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
  
      if (!input.files?.length) {
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        setImage(reader.result as string);
        decodeQRCode(reader.result as string);
      };
  
      if (file) {
        reader.readAsDataURL(file);
      }
    };

    const validate = (decoded: string) => {
      if (!isScanning) {
          setIsScanning(true);
          if (validateQR(decoded)) {
              const decodedID = decoded.replace("https://secure-petz.info/", "");
              // console.info("decoded: " + decodedID);
              axiosPrivate
                  .get(`/pet/${decodedID}`)
                  .then((response) => {
                      const data = response.data;
                      if (data.owner) {
                          setAlertResponse({ status : "error", title: "QR Code Already Used", message: "The provided QR Code has already been taken. Please get a new one."});
                          onOpenAlert();
                      } else {
                          onCloseAlert();
                          navigate(`/pet/${decodedID}/create`, { replace: true });
                      }
                  })
                  .catch((error) => {
                      // console.error(error.response.status);
                      if (error.response.status === 404) {
                        setAlertResponse({ status : "error", title: "QR Code Not Recognized", message: "The provided QR Code could not be found. Please try again."});
                        onOpenAlert();
                      }
                  })
                  .finally(() => {
                      setTimeout(() => {
                          setIsScanning(false);
                      }, 2000); // Changed delay to 4 seconds
                  });
          } else {
            setAlertResponse({ status : "error", title: "Invalid QR Code", message: "The provided QR Code is not valid. Please try scanning a different QR Code."});
            onOpenAlert();
              setTimeout(() => {
                  setIsScanning(false);
              }, 2000); // Changed delay to 4 seconds
          }
      }
  };

    const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
        const { email } = inputs

        const loginData = {email: emailValue}

        await axios.post("/user/check/email", loginData)
        .then(response => {
            setAlertResponse({ status : "success", title: "Reset link sent", message: "Password reset link is sent to your email address."});
            onOpenAlert();
            setUsername("");
        })
        .catch(error => {
            switch (error.code) {
                case "ERR_NETWORK":
                  onOpenAlert();
                    setAlertResponse({ status : "error", title: error.response.statusText, message: "No response from server."});
                    break;
                case "ERR_BAD_REQUEST":
                    if(error.response.status === 400){
                        setAlertResponse({ status : "error", title: error.response.statusText, message: error.response?.data?.detail});
                    }
                    else{
                        setAlertResponse({ status : "error", title: error.response.statusText, message: error.response?.data?.detail});
                    }
                    break;
                default:
                    setAlertResponse({ status : "error", title: error.response.statusText, message: error.response?.data?.detail});
            }
            onOpenAlert();
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
              <ChakraImage
                src="/logo/logo-blue.png"
                width={75}
                height={75}
                alt="Picture of the author"
              />
              <h1 className="font-semibold text-[#0E67B5] text-2xl">PetNFC</h1>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-6 md:px-0 flex flex-col form-container w-full max-w-sm mb-20"
            >
              <h1 className="text-2xl text-center font-semibold text-gray-700">
                Select Sign Up Option
              </h1>
              {/* <p className="text-sm text-center text-gray-500 mt-2">
                You will get an email with a reset link
              </p> */}

              <div className="flex items-center justify-center mt-4">
                <Alert status={alertResponse.status} display={isVisible ? "flex" : "none"} alignItems="center" justifyContent="start">
                    <AlertIcon width={4}/>
                    <Box flexGrow={1}>
                        <AlertTitle className="text-sm">{alertResponse.title}</AlertTitle>
                        <AlertDescription className="text-sm">
                            {alertResponse.message}
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-1}
                        top={-1}
                        onClick={onCloseAlert}
                    />
                </Alert>
              </div>

              <div className="mt-4">
                <div className="transition ease-in-out duration-200 group flex flex-col items-center justify-center outline outline-2 outline-offset-2 outline-sky-600 rounded-lg py-4 cursor-pointer hover:bg-sky-600" onClick={onOpenModal}>
                  <HiOutlineQrCode size={40} className="transition ease-in-out duration-200 text-sky-600 group-hover:text-white"/>
                  <Text className="transition ease-in-out duration-200 text-sky-600 font-semibold group-hover:text-white">Scan QR Code</Text>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="file" className="transition ease-in-out duration-200 group flex flex-col items-center justify-center outline outline-2 outline-offset-2 outline-sky-600 rounded-lg py-4 cursor-pointer hover:bg-sky-600">
                  <HiOutlineFolderOpen size={40} className="transition ease-in-out duration-200 text-sky-600 group-hover:text-white"/>
                  <Text className="transition ease-in-out duration-200 text-sky-600 font-semibold group-hover:text-white">Upload QR Code</Text>
                </label>
                <input
                    className="hidden"
                    type="file"
                    id="file"
                    name="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleImageUpload}
                  />
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
            <ChakraImage
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


      <Modal onClose={onCloseModal} size="full" isOpen={isOpenModal}>
        <ModalOverlay />
        <ModalContent className="relative">
          <div className="absolute flex flex-col bg--300 items-center justify-evenly min-h-screen w-full">
            <div className="w-full grow z-50 flex max-h-44 bg--100 justify-center items-center">
              <h1 className="text-lg font-semibold text-slate-700 text-center px-8">
                Please align the QR Code with the scanner for optimal
                recognition.
              </h1>
            </div>
            <div className="w-full sm:w-4/6 md:w-3/6 lg:w-2/6 xl:1/6">
              <QrScanner
              tracker={false}
                onDecode={(result) => validate(result)}
                onError={(error) => console.log(error?.message)}
              />
            </div>
            <div className="w-full grow flex z-50 bg--100 justify-center items-center">
              <button
                className="text-sm text-white bg-red-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
                onClick={onCloseModal}
              >
                Cancel Scanning
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
      
      <ToastContainer />
    </section>
  );
};

export default SignUpOptionPage;
