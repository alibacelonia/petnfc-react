import { QrScanner } from "@yudiel/react-qr-scanner";
import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import React from "react";
import { changePage } from "../../../../../flux/navigation/action";
import {
  Box,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { axiosPrivate } from "../../../../../api/axios";
import jsQR, { QRCode } from "jsqr";
import { PetInfo } from "../../../../../flux/pets/types";
import { ActionMeta, ChakraStylesConfig, OptionBase, Select } from "chakra-react-select";
import moment from "moment";
import { Controller, SubmitHandler, set, useForm } from "react-hook-form";
import { PetInfoContext } from "../../../../../flux/pets/store";
import { addPet, changePet } from "../../../../../flux/pets/action";
import { UserInfoContext } from "../../../../../flux/user/store";

const validateQR = (text: string): boolean => {
  const pattern =
    /^https:\/\/secure-petz\.info\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return pattern.test(text);
};

const steps = [
  { title: "Step 1", description: "Scan or Upload QR" },
  { title: "Step 2 ", description: "Fill up all required information" },
];

const petCharacteristics = [
  { label: "Playful", value: "playful" },
  { label: "Affectionate", value: "affectionate" },
  { label: "Loyal", value: "loyal" },
  { label: "Energetic", value: "energetic" },
  { label: "Curious", value: "curious" },
  { label: "Intelligent", value: "intelligent" },
  { label: "Independent", value: "independent" },
  { label: "Shy", value: "shy" },
  { label: "Social", value: "social" },
  { label: "Timid", value: "timid" },
  { label: "Confident", value: "confident" },
  { label: "Obedient", value: "obedient" },
  { label: "Adventurous", value: "adventurous" },
  { label: "Gentle", value: "gentle" },
  { label: "Protective", value: "protective" },
  { label: "Cuddly", value: "cuddly" },
  { label: "Vocal", value: "vocal" },
  { label: "Aloof", value: "aloof" },
  { label: "Calm", value: "calm" },
  { label: "Reserved", value: "reserved" },
  { label: "Mischievous", value: "mischievous" },
  { label: "Aggressive", value: "aggressive" },
  { label: "Fearful", value: "fearful" },
  { label: "Active", value: "active" },
  { label: "Lazy", value: "lazy" },
];


const API_URL = process.env.REACT_APP_BACKEND_URL;
interface MyObject {
  [key: string]: any;
}
interface ValueLabelPair {
  value: number;
  label: string;
  isDisabled: boolean;
}

export interface BehaviorOption extends OptionBase {
  label: string;
  value: string;
}

export type Inputs = {
  behavior: string;
  description: string;
  weight: number;
  pet_type_id: number;
  gender: string;
  name: string;
  microchip_id: string;
  breed: string;
  color: string;
  date_of_birth_month: number;
  date_of_birth_year: number;
}

const gender = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Desexed Male', label: 'Desexed Male' },
  { value: 'Desexed Female', label: 'Desexed Female' },
];


// Generate months using Moment.js
const months: ValueLabelPair[] = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: moment().month(i).format('MMMM'),
  isDisabled: false
  // isDisabled: i+1 == 12 ? true : false
}));

// Generate years (50 years before the current year) using Moment.js
const currentYear = moment().year();
const years: ValueLabelPair[] = Array.from({ length: 50 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
  isDisabled: false
}));


const chakraStyles: ChakraStylesConfig = {
  dropdownIndicator: (provided, state) => ({
    ...provided,
    background: "provided.background",
    fontSize: "16px",
  }),
  control: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    _placeholder: "",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  crossIcon: (provided, state) => ({
    ...provided,
    fontSize: "12px",
  }),
};


const PetAddPage = () => {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const { userState, userDispatch } = React.useContext(UserInfoContext);
  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const { petState, petDispatch } = React.useContext(PetInfoContext);
  
  const [petTypes, setPetTypes] = useState([]);

  const [pet_type_id, setPetTypeID] = useState<object | null>(null);
  const [pet_gender, setPetGender] = useState<object | null>(null);
  const [pet_birth_year, setPetBirthYear] = useState<object | null>(null);
  const [pet_birth_month, setPetBirthMonth] = useState<object | null>(null);

  const [selectedBehaviour, setSelectedBehaviour] = useState< BehaviorOption[]>([]);

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { goToNext, goToPrevious, activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });


  const linkedID = localStorage.getItem('linkedID');
  const [loadedLinkedID, setLoadedLinkedID] = useState(false);
  const [isScanning, setIsScanning] = useState(false);


  const [image, setImage] = useState<string | null>(null);
  const [formdata, setFormData] = useState<PetInfo>({
    id: 0,
    owner_id: userState.userInfo.id || "",
    name: "",
    breed: "",
    pet_type_id: 0,
    microchip_id: "",
    unique_id: "",
    main_picture: "",
    color: "",
    gender: "",
    date_of_birth_year: 0,
    date_of_birth_month: 0,
    weight: 0,
    behavior: "",
    description: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    axiosPrivate.get('/pet/pet-types')
    .then((response) => {
      setPetTypes(response.data)
    })

    if (linkedID!=null && !loadedLinkedID) {
      setActiveStep(1)
      setFormData(pageState.pageData)
    }
    
  }, []);



  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const key = name
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }

  const onChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      "description": value,
    }));
    
  }

  const onChangeSelect = (newValue: unknown, action: ActionMeta<unknown>) => {
  // const onChangeSelect = (newValue: unknown) => {
    if (typeof newValue === 'object') {
      // Now we know myObject is an object
      console.info(`newValue: `, newValue)
      console.info(`action: `, action)
      const key: any = action.name
      const data = JSON.stringify(newValue)
      const newData = JSON.parse(data)

      setFormData((prevData) => ({
        ...prevData,
        [key]: newData.value
      }));
      
      if(key === 'pet_type_id') {setPetTypeID(petTypes.filter((type) => {return type['value'] ==  newData.value}))}
      if(key === 'gender') {setPetGender(gender.filter((type) => {return type['value'].toLowerCase() ==  newData.value.toLowerCase()}))}
      if(key === 'date_of_birth_month') {setPetBirthMonth(months.filter((type) => {return type['value'] ==  newData.value}))}
      if(key === 'date_of_birth_year') {setPetBirthYear(years.filter((type) => {return type['value'] ==  newData.value}))}

      if (key === "behavior") {
        setSelectedBehaviour(newData);
        console.info("newData", newData)
        
        let behaviors = (newData as BehaviorOption[]).map(item => item.value).join(",");
        setFormData((prevData) => ({
          ...prevData,
          [key]: behaviors,
        }));
      }
      // console.info(`key: `, key)
      // console.info(`new value: `, newData)
      // console.info(`formdata value: `, formdata.gender)
      // console.info(`formdata: `, formdata)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target

    if (!input.files?.length) {
      setPreviewURL(null);
      setFormData((prevData) => ({
        ...prevData,
        "main_picture": formdata.main_picture,
      }));
        return;
    }

    const file = input.files[0];
    // console.info("selected file: ",file);

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const url =  reader.result as string
      setPreviewURL(url);
      setFormData((prevData) => ({
        ...prevData,
        "main_picture": url,
      }));
    };
    
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        "main_picture": formdata.main_picture,
      }));
      setPreviewURL(null);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    // e.preventDefault();
    console.info("formdata: ", formdata) 
    // console.log(pet_birth_year);

    // const changes: PetInfo = Object.keys(formdata)
    //   .filter((key) => formdata[key as keyof PetInfo] !== "")
    //   .reduce((acc, key) => {
    //     acc[key as keyof PetInfo] = formdata[key as keyof PetInfo];
    //     return acc;
    //   }, {} as PetInfo);


    // const keys = Object.keys(changes);
    // console.log(changes)
    // console.info("keys: ", keys)
    if(file!=null) {

      const formDataWithFile = new FormData();
      formDataWithFile.append("guid", formdata.unique_id);

      for (const key in formdata) {
        if (formdata.hasOwnProperty(key)) {
          const value = (formdata as any)[key]; // Type assertion here
          formDataWithFile.append(key, value);
        }
      }

      formDataWithFile.append("file", file as Blob);


      axios.post(`/pet/update`, formDataWithFile,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
        .then((response) => {
          petDispatch(addPet(response.data));
          pageDispatch(changePage("home_pet_details", response.data))
        })
        .catch((error) => {
          console.error(error)
        });
    }
    else{
      axiosPrivate.put(`/pet/${formdata.unique_id}/update`, formdata)
        .then((response) => {
          petDispatch(addPet(response.data));
          pageDispatch(changePage("home_pet_details", response.data))
        })
        .catch((error) => {
          console.error(error)
        });
    }

  }


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
        toast({
          position: "top",
          title: "Invalid QR Code",
          description:
            "The provided image does not contain a valid QR Code. Please upload a valid QR Code image.",
          status: "error",
          isClosable: true,
          duration: 4000,
        });
      }
    };
  };

  const validate = (decoded: string) => {
    if (!isScanning) {
        setIsScanning(true);
        if (validateQR(decoded)) {
            const decodedID = decoded.replace("https://secure-petz.info/", "");
            console.info("decoded: " + decodedID);
            axiosPrivate
                .get(`/pet/${decodedID}`)
                .then((response) => {
                    const data = response.data;
                    if (data.owner_id) {
                        toast({
                            position: "top",
                            title: "QR Code Already Used",
                            description:
                                "The provided QR Code has already been taken. Please get a new one.",
                            status: "error",
                            isClosable: true,
                            duration: 4000,
                        });
                    } else {
                        setFormData(data);
                        console.info("not existed", data);
                        goToNext();
                        onClose();
                    }
                })
                .catch((error) => {
                    console.error(error.response.status);
                    if (error.response.status === 404) {
                        toast({
                            position: "top",
                            title: "QR Code Not Recognized",
                            description:
                                "The provided QR Code could not be found. Please try again.",
                            status: "error",
                            isClosable: true,
                            duration: 4000,
                        });
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsScanning(false);
                    }, 4000); // Changed delay to 4 seconds
                });
        } else {
            toast({
                position: "top",
                title: "Invalid QR Code",
                description:
                    "The provided QR Code is not valid. Please try scanning a different QR Code.",
                status: "error",
                isClosable: true,
                duration: 4000,
            });

            setTimeout(() => {
                setIsScanning(false);
            }, 4000); // Changed delay to 4 seconds
        }
    }
};


  useEffect(() => {
    console.info("Is Scanning: ", isScanning);
  }, [isScanning]);

  const StepOne = () => {
    return (
      <>
        <div className="flex flex-col h-40 bg--200 mt-10 justify-evenly items-center">
          <button
            onClick={onOpen}
            className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
          >
            Scan QR Code
          </button>
          <h1 className="text-sm">OR</h1>
          <label
            htmlFor="file"
            className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
          >
            Upload QR Code
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
      </>
    );
  };

  const StepTwo = () => {
    return (
      <>
        <div className="relative bg-white mt-5 rounded-2xl p-6 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="post"
            encType="multipart/form-data"
          >
            <div className="border-b border-gray-900/10 pb-12">
              <div className="grid grid-cols-12 gap-3">
                {/* Pet Image */}
                <div className="col-span-full">
                  <div className="mt-2 flex flex-col items-center gap-4 gap-x-3">
                    {/* Image Preview */}
                    {previewURL ? (
                      <div className="p-1 border-4 border-amber-400 rounded-full">
                        <img
                          className="inline-block h-48 w-48 rounded-full ring-2 ring-white object-cover "
                          src={previewURL}
                          alt=""
                          // onClick={handleImageClick}
                        />
                      </div>
                    ) : (
                      <div className="p-1 border-4 border-amber-400 rounded-full">
                        <img
                          className="inline-block h-48 w-48 rounded-full ring-2 ring-white object-cover "
                          src={`${"/assets/no_image.png"}`}
                          alt="Pet Image"
                        />
                      </div>
                    )}

                    <p className="font-bold text-red-500 text-sm">
                      {/* {petProfileError} */}
                    </p>

                    <label
                      htmlFor="file"
                      className="rounded-md text-white bg-blue-500 px-5 md:px-8 py-3 text-xs md:text-sm shadow-sm cursor-pointer"
                    >
                      {" "}
                      Change Pet Photo{" "}
                    </label>
                    <span className="text-sm leading-6 text-gray-600 text-center">
                      {/* The image selected will be the display picture of your pet
                      in the website.{" "} */}
                    </span>
                    <input
                      className="hidden"
                      type="file"
                      id="file"
                      name="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>


                {/* Pet Description */}
                <div className="col-span-full">
                 <FormControl isInvalid={!!errors.description}>
                  <FormLabel fontSize="sm" color="gray.900" >Description</FormLabel>
                  <Textarea
                      borderRadius="md"
                      fontSize="sm"
                      size="sm"
                      cols={2}
                      rows={4}
                      {...register("description", {
                      })}
                      value={formdata.description || ""}
                      onChange={onChangeTextArea}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.description && errors.description.message}
                    </FormErrorMessage>
                 </FormControl>
                </div>

                {/* Pet Behaviour */}
                <div className="col-span-full">
                  <FormControl isInvalid={!!errors.behavior}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Characteristics <span className="text-red-500 text-base"></span>
                    </FormLabel>

                    <Controller
                      name="behavior"
                      control={control}
                      rules={{
                        validate: (selectedBehaviour) => {
                          return selectedBehaviour?.length > 5 ? "Please select up to five pet characteristics only." : true
                        },
                      }}
                      render={({ field }) => (
                        <Select
                        {...field}
                          isMulti
                          options={petCharacteristics}
                          placeholder="Select your pet characteristics (maximum of 5)"
                          closeMenuOnSelect={false}
                          value={selectedBehaviour}
                          onChange={(selectedOptions, action) => {
                            field.onChange(selectedOptions);
                            onChangeSelect(selectedOptions, action);
                          }}
                          size="lg"
                          chakraStyles={chakraStyles}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.behavior && errors.behavior.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Weight */}
                <div className="col-span-full md:col-span-6">
                <FormControl  isInvalid={!!errors.weight}>
                  <FormLabel fontSize="sm" color="gray.900" >Pet Weight (lbs) <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="weight"
                      control={control}
                      rules={{ 
                        required: 'This is a required field.', 
                        min: {
                          value: 1,
                          message: "Minimum value for this field is 1"
                        },
                        max: {
                          value: 500,
                          message: "Maximum value for this field is 500"
                        }
                      }} // Add validation rules if needed
                      render={({ field }) => (
                        <NumberInput
                        size="lg"
                          value={field.value}
                          min={1}
                          max={500}
                          keepWithinRange={true}
                          clampValueOnBlur={false}
                          onChange={(valueString, valueNumber) => {
                            if(Number.isNaN(valueNumber)) {
                              field.onChange("");
                            }
                            else{
                              field.onChange(valueNumber);
                            }
                            setFormData((prevData) => ({
                              ...prevData,
                              "weight": valueNumber,
                            }));
                          }}
                        >
                          <NumberInputField fontSize="sm" />
                        </NumberInput>
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.weight && errors.weight.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Type */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.pet_type_id}>
                    <FormLabel fontSize="sm" color="gray.900" >Pet Type <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="pet_type_id"
                      control={control}
                      rules={{ required: 'This is a required field.' }} // Add validation rules if needed
                      render={({ field }) => (
                        <Select
                          id="pet_type_id"
                          {...field}
                          options={petTypes}
                          size="lg"
                          chakraStyles={chakraStyles}
                          placeholder="Select kind of pet"
                          onChange={(e, a) => {
                            field.onChange(e);
                            // Add your additional onChange logic here
                            // For example, you can call your custom onChangeSelect function if needed
                            onChangeSelect(e, a);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.pet_type_id && errors.pet_type_id.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Gender */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.gender}>
                    <FormLabel fontSize="sm" color="gray.900" >Gender <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: 'This is a required field.' }} // Add validation rules if needed
                      render={({ field }) => (
                        <Select
                          id="gender"
                          {...field}
                          options={gender}
                          size="lg"
                          chakraStyles={chakraStyles}
                          placeholder="Select pet gender"
                          onChange={(e, a) => {
                            field.onChange(e);
                            // Add your additional onChange logic here
                            // For example, you can call your custom onChangeSelect function if needed
                            onChangeSelect(e, a);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.gender && errors.gender.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Name */}
                <div className="col-span-full md:col-span-6">
                  
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" color="gray.900" >Pet Name <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: 'This is a required field.',
                        maxLength: {
                          value: 50,
                          message: 'Pet name cannot be longer than 50 characters'
                        }
                      }} // Add validation rules if needed
                      render={({ field }) => (
                        <Input
                          {...field}
                          fontSize="sm"
                          size="lg"
                          value={formdata.name || ""}
                          onChange={(e)=>{
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                    {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Microchip ID */}
                <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.microchip_id}>
                    <FormLabel fontSize="sm" color="gray.900" >Microchip Number <span className="text-red-500 text-base">*</span></FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("microchip_id", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 30,
                          message: "Microchip Number cannot be longer than 30 characters"
                        }
                      })}
                      value={formdata.microchip_id  || ""}
                      onChange={onChangeInput}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.microchip_id && errors.microchip_id.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Breed */}
                <div className="col-span-full md:col-span-6 sm:col-start-1">
                <FormControl isInvalid={!!errors.breed}>
                    <FormLabel fontSize="sm" color="gray.900" >Breed <span className="text-red-500 text-base">*</span></FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("breed", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 50,
                          message: "Breed cannot be longer than 50 characters"
                        }
                      })}
                      value={formdata.breed  || ""}
                      onChange={onChangeInput}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.breed && errors.breed.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>


                {/* Birth Year */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.date_of_birth_year}>
                    <FormLabel fontSize="sm" color="gray.900" >Birth Year <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="date_of_birth_year"
                      control={control}
                      rules={{ required: 'This is a required field.' }} // Add validation rules if needed
                      render={({ field }) => (
                        <Select
                          id="date_of_birth_year"
                          {...field}
                          options={years}
                          size="lg"
                          chakraStyles={chakraStyles}
                          placeholder="Select your pet's birth year"
                          onChange={(e, a) => {
                            field.onChange(e);
                            // Add your additional onChange logic here
                            // For example, you can call your custom onChangeSelect function if needed
                            onChangeSelect(e, a);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.date_of_birth_year && errors.date_of_birth_year.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Birth Month */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.date_of_birth_month}>
                    <FormLabel fontSize="sm" color="gray.900" >Birth Month <span className="text-red-500 text-base">*</span></FormLabel>
                    <Controller
                      name="date_of_birth_month"
                      control={control}
                      rules={{ required: 'This is a required field.' }} // Add validation rules if needed
                      render={({ field }) => (
                        <Select
                          id="date_of_birth_month"
                          {...field}
                          options={months}
                          size="lg"
                          chakraStyles={chakraStyles}
                          placeholder="Select your pet's birth month"
                          onChange={(e, a) => {
                            field.onChange(e);
                            // Add your additional onChange logic here
                            // For example, you can call your custom onChangeSelect function if needed
                            onChangeSelect(e, a);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.date_of_birth_month && errors.date_of_birth_month.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>



                {/* Pet Color */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.color}>
                    <FormLabel fontSize="sm" color="gray.900" >Color <span className="text-red-500 text-base">*</span></FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("color", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 30,
                          message: "Color cannot be longer than 30 characters"
                        }
                      })}
                      value={formdata.color  || ""}
                      onChange={onChangeInput}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.color && errors.color.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

              </div>
            </div>

            {/* Cancel and Submit Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
              type="button"
                onClick={goToPrevious}
                className="text-xs lg:text-sm text-gray-700  bg-gray-200 px-8 py-3 rounded-md shadow-md  hover:bg-gray-300 transition duration-150 ease-out"
              >
                Back
              </button>
              <button
                // disabled={!isEnabledSubmit}
                type="submit"
                className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  const pages = [StepOne(), StepTwo()];

  const renderPage = () => {
    return pages[activeStep];
  };

  const handleClick = (page: string) => {
    console.info("this is handleClick: ", page);
    pageDispatch(changePage(page));
  };

  useEffect(() => {
    console.log(activeStep);
  }, [activeStep]);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10 ">
        <div className="flex justify-start items-center">
          <h1
            onClick={() => pageDispatch(changePage("home"))}
            className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"
          >
            <FiChevronLeft size={14} className="" /> Back
          </h1>
        </div>
        <div className="flex items-center min-w-full justify-start h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Register Pet
          </h1>
        </div>
        <div className="relative min-h-fit bg-white mt-5 px-4 md:px-8 py-6 md:py-10 rounded-2xl shadow-md ">
          <div className="min-w-screen flex flex-col items-center ">
            <div className=" bg-white w-full md:w-5/6 lg:w-4/6 xl:w-3/6">
              <Stepper size="sm" index={activeStep}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle
                        className={`${activeStep === index ? "" : "hidden"}`}
                      >
                        {step.title}
                      </StepTitle>
                      <StepDescription
                        className={`${activeStep === index ? "" : "hidden"}`}
                      >
                        {step.description}
                      </StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </div>
          </div>

          {renderPage()}
        </div>
      </div>

      <Modal onClose={onClose} size="full" isOpen={isOpen}>
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
                onDecode={(result) => validate(result)}
                onError={(error) => console.log(error?.message)}
              />
            </div>
            <div className="w-full grow flex z-50 bg--100 justify-center items-center">
              <button
                className="text-sm text-white bg-red-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
                onClick={onClose}
              >
                Cancel Scanning
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default PetAddPage;
