import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import { PetInfo } from "../../../../../flux/pets/types";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import {
  ActionMeta,
  ChakraStylesConfig,
  OptionBase,
  Select,
} from "chakra-react-select";
import axios, { axiosPrivate } from "../../../../../api/axios";

import moment from "moment";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { changePage } from "../../../../../flux/navigation/action";
import { FiChevronLeft } from "react-icons/fi";
import { PetInfoContext } from "../../../../../flux/pets/store";
import { changePet } from "../../../../../flux/pets/action";

const API_URL = process.env.REACT_APP_BACKEND_URL;
interface MyObject {
  [key: string]: any;
}
interface ValueLabelPair {
  value: number;
  label: string;
  isDisabled: boolean;
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
};

export interface BehaviorOption extends OptionBase {
  label: string;
  value: string;
}

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

const gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Desexed Male", label: "Desexed Male" },
  { value: "Desexed Female", label: "Desexed Female" },
];

// Generate months using Moment.js
const months: ValueLabelPair[] = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: moment().month(i).format("MMMM"),
  isDisabled: false,
  // isDisabled: i+1 == 12 ? true : false
}));

// Generate years (50 years before the current year) using Moment.js
const currentYear = moment().year();
const years: ValueLabelPair[] = Array.from({ length: 50 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
  isDisabled: false,
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

const PetEditPage = () => {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const { petState, petDispatch } = React.useContext(PetInfoContext);
  const pd = pageState.pageData;

  const [petInfo, setPetInfo] = useState<PetInfo>(pd);
  const [formdata, setFormData] = useState<PetInfo>(petInfo);
  const [petTypes, setPetTypes] = useState([]);

  const [pet_type_id, setPetTypeID] = useState<object | null>(null);
  const [pet_gender, setPetGender] = useState<object | null>(null);
  const [pet_birth_year, setPetBirthYear] = useState<object | null>(null);
  const [pet_birth_month, setPetBirthMonth] = useState<object | null>(null);

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [selectedBehaviour, setSelectedBehaviour] = useState< BehaviorOption[]>([]);

  useEffect(() => {
    axiosPrivate.get("/pet/pet-types").then((response) => {
      setPetTypes(response.data);
      setPetTypeID(
        response.data.filter((type: any) => {
          return type["value"] == petInfo.pet_type_id;
        })
      );
    });
    
    setPetGender(
      gender.filter((type: any) => {
        return type["value"].toLowerCase() === petInfo.gender.toLowerCase();
      })
    );
    setPetBirthYear(
      years.filter((type: any) => {
        return type["value"] === petInfo.date_of_birth_year;
      })
    );
    setPetBirthMonth(
      months.filter((type: any) => {
        return type["value"] === petInfo.date_of_birth_month;
      })
    );

    if(petInfo.behavior != null && petInfo.behavior != "") {
      setSelectedBehaviour(
        petCharacteristics.filter(characteristic => {
          return (petInfo.behavior.split(",")).includes(characteristic.value);
        })
      );
    }
  }, []);

  useEffect(() => {
    // console.info("type_id: ", pet_type_id)
  }, [pet_type_id]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const onChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));

    // console.info(`key: `, name)
    // console.info(`new value: `, value)
    // console.info(`formdata value: `, formdata.description)
  };

  const filterChanges = (original: MyObject, updated: MyObject) => {
    let changedKeys: MyObject = {};

    for (let key in original) {
      if (original[key] !== updated[key]) {
        changedKeys[key] = updated[key];
      }
    }

    return changedKeys;
  };

  const onChangeSelect = (newValue: unknown, action: ActionMeta<unknown>) => {
    if (typeof newValue === "object") {
      // Now we know myObject is an object

      const key: any = action.name;
      const data = JSON.stringify(newValue);
      const newData = JSON.parse(data);

      setFormData((prevData) => ({
        ...prevData,
        [key]: newData.value,
      }));

      if (key === "pet_type_id") {
        setPetTypeID(
          petTypes.filter((type) => {
            return type["value"] == newData.value;
          })
        );
      }
      if (key === "gender") {
        setPetGender(
          gender.filter((type) => {
            return type["value"].toLowerCase() == newData.value.toLowerCase();
          })
        );
      }
      if (key === "date_of_birth_month") {
        setPetBirthMonth(
          months.filter((type) => {
            return type["value"] == newData.value;
          })
        );
      }
      if (key === "date_of_birth_year") {
        setPetBirthYear(
          years.filter((type) => {
            return type["value"] == newData.value;
          })
        );
      }
      if (key === "behavior") {
        setSelectedBehaviour(newData);
        // console.info("newData", newData)
        
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
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;

    if (!input.files?.length) {
      setPreviewURL(null);
      setFormData((prevData) => ({
        ...prevData,
        main_picture: petInfo.main_picture,
      }));
      return;
    }

    const file = input.files[0];
    // console.info("selected file: ",file);

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPreviewURL(url);
      setFormData((prevData) => ({
        ...prevData,
        main_picture: url,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        main_picture: petInfo.main_picture,
      }));
      setPreviewURL(null);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    // e.preventDefault();
    // console.info("formdata: ", formdata)
    // console.log(pet_birth_year);
    const changes = filterChanges(petInfo, formdata);
    const keys = Object.keys(changes);
    // console.info("changes: ",changes);
    // console.info("keys: ", keys);


    if (keys.length > 0) {
      if (keys.includes("main_picture")) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("guid", formdata.unique_id);

        for (const key in formdata) {
          if (formdata.hasOwnProperty(key)) {
            const value = (formdata as any)[key]; // Type assertion here
            formDataWithFile.append(key, value);
          }
        }

        formDataWithFile.append("file", file as Blob);

        axios
          .post(`/pet/update`, formDataWithFile, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          })
          .then((response) => {
            petDispatch(changePet(response.data));
            pageDispatch(changePage("home_pet_details", response.data));
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axiosPrivate
          .put(`/pet/${petInfo.unique_id}/update`, changes)
          .then((response) => {
            petDispatch(changePet(response.data));
            pageDispatch(changePage("home_pet_details", response.data));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      toast({
        position: "top",
        title: "No Changes Found",
        description:
          "Unable to update pet details as there are no changes detected",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
    }
  };

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Edit Pet Details
          </h1>
        </div>
        <div className="relative bg-white mt-5 rounded-2xl shadow-md p-6 overflow-hidden">
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
                          src={`${
                            petInfo.main_picture
                              ? API_URL + petInfo.main_picture
                              : "/assets/no_image.png"
                          }`}
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
                    <FormLabel fontSize="sm" color="gray.900">
                      Description{" "}
                    </FormLabel>
                    <Textarea
                      borderRadius="md"
                      fontSize="sm"
                      size="sm"
                      cols={2}
                      rows={4}
                      {...register("description", {})}
                      value={formdata.description || ""}
                      onChange={onChangeTextArea}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.description && errors.description.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Weight (lbs){" "} */}
                {/* Pet Behaviour */}
                <div className="col-span-full">
                  <FormControl isInvalid={!!errors.behavior}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Characteristics <span className="text-red-500 text-base"></span>
                    </FormLabel>
                    {/* <Input
                      maxLength={100}
                      fontSize="sm"
                      size="lg"
                      {...register("behavior", {
                      })}
                      value={formdata.behavior || ""}
                      onChange={onChangeInput}
                    /> */}

                    {/* <Select
                      isMulti
                      name="behavior"
                      options={petCharacteristics}
                      placeholder="Select some colors..."
                      closeMenuOnSelect={false}
                      value={selectedBehaviour}
                      onChange={onChangeSelect}
                        size="lg" 
                        chakraStyles={chakraStyles}
                    /> */}

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
                            // console.info("xioa: ",selectedOptions)
                            onChangeSelect(selectedOptions, action);

                            // setFormData((prevData) => ({
                            //   ...prevData,
                            //   "behavior": selectedOptions,
                            // }));
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
                  <FormControl isInvalid={!!errors.weight}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Pet Weight (lbs){" "}
                      <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Input
                      maxLength={100}
                      fontSize="sm"
                      size="lg"
                      {...register("weight", {
                        required: "This is a required field.",
                      })}
                      value={formdata.weight}
                      onChange={onChangeInput}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.weight && errors.weight.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Type */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.pet_type_id}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Pet Type <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Select
                      id="pet_type_id"
                      name="pet_type_id"
                      value={pet_type_id}
                      onChange={onChangeSelect}
                      size="lg"
                      chakraStyles={chakraStyles}
                      placeholder="Select kind of pet"
                      options={petTypes}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.pet_type_id && errors.pet_type_id.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Gender */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.gender}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Gender <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Select
                      id="gender"
                      name="gender"
                      value={pet_gender}
                      onChange={onChangeSelect}
                      options={gender}
                      size="lg"
                      chakraStyles={chakraStyles}
                      placeholder="Select pet gender"
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.gender && errors.gender.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Name */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Pet Name <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("name", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 100,
                          message: "Name cannot be longer than 100 characters",
                        },
                      })}
                      value={formdata.name}
                      onChange={onChangeInput}
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Microchip ID */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.microchip_id}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Microchip Number{" "}
                      <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("microchip_id", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 30,
                          message:
                            "Microchip Number cannot be longer than 30 characters",
                        },
                      })}
                      value={formdata.microchip_id}
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
                    <FormLabel fontSize="sm" color="gray.900">
                      Breed <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("breed", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 50,
                          message: "Breed cannot be longer than 50 characters",
                        },
                      })}
                      value={formdata.breed}
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
                    <FormLabel fontSize="sm" color="gray.900">
                      Birth Year{" "}
                      <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Select
                      name="date_of_birth_year"
                      id="date_of_birth_year"
                      value={pet_birth_year}
                      onChange={onChangeSelect}
                      options={years}
                      size="lg"
                      chakraStyles={chakraStyles}
                      placeholder="Select pet gender"
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.date_of_birth_year &&
                        errors.date_of_birth_year.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Birth Month */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.date_of_birth_month}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Birth Month{" "}
                      <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Select
                      name="date_of_birth_month"
                      id="date_of_birth_month"
                      value={pet_birth_month}
                      onChange={onChangeSelect}
                      options={months}
                      size="lg"
                      chakraStyles={chakraStyles}
                      placeholder="Select your pet's birth month"
                    />
                    <FormErrorMessage fontSize="xs">
                      {errors.date_of_birth_month &&
                        errors.date_of_birth_month.message}
                    </FormErrorMessage>
                  </FormControl>
                </div>

                {/* Pet Color */}
                <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.color}>
                    <FormLabel fontSize="sm" color="gray.900">
                      Color <span className="text-red-500 text-base">*</span>
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      size="lg"
                      {...register("color", {
                        required: "This is a required field.",
                        maxLength: {
                          value: 30,
                          message: "Color cannot be longer than 30 characters",
                        },
                      })}
                      value={formdata.color}
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
                onClick={() =>
                  pageDispatch(changePage("home_pet_details", petInfo))
                }
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
      </div>

      <ToastContainer />
    </>
  );
};

export default PetEditPage;
