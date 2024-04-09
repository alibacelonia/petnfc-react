import moment from "moment";
import { GiMedicines } from "react-icons/gi";
import {
  BiEditAlt,
  BiSolidInjection,
  BiSolidVirus,
  BiTrash,
} from "react-icons/bi";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import { PetInfo } from "../../../../../flux/pets/types";
import { FiChevronLeft } from "react-icons/fi";
import { changePage } from "../../../../../flux/navigation/action";
import { AddIcon } from "@chakra-ui/icons";
import {
  ChevronLeftIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  CloseButton,
  FormControl,
  Text,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Icon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { axiosPrivate } from "../../../../../api/axios";
import { PetInfoContext } from "../../../../../flux/pets/store";
import { changePet } from "../../../../../flux/pets/action";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export type AllergyInputs = {
  allergy: string;
  symptoms: string;
};

export type MedicationInputs = {
  name: string;
  brand: string;
  dosage: string;
  prescription: string;
};

export type VaccineInputs = {
  name: string;
  type: string;
  clinic: string;
  date: string;
};

export type FormInputs = {
  allergies: AllergyInputs;
  medications: MedicationInputs;
  vaccines: VaccineInputs;
};

type FocusableElement = HTMLElement | SVGElement | Element | null;

export type SelectedItemData = {
  index: number;
  set: string;
};

const PetDetailsPage = () => {
  const { petState, petDispatch } = React.useContext(PetInfoContext);
  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const [petInfo, setPetInfo] = useState<PetInfo>(pageState.pageData);

  const [currentOpenModal, setCurrentOpenModal] = useState("");

  const {
    isOpen: isOpenModalAllergies,
    onOpen: onOpenModalAllergies,
    onClose: onCloseModalAllergies,
  } = useDisclosure();
  const {
    isOpen: isOpenModalMedications,
    onOpen: onOpenModalMedications,
    onClose: onCloseModalMedications,
  } = useDisclosure();
  const {
    isOpen: isOpenModalVaccines,
    onOpen: onOpenModalVaccines,
    onClose: onCloseModalVaccines,
  } = useDisclosure();

  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onClose: onCloseAlertDialog,
  } = useDisclosure();
  const alertDialogCancelRef = React.useRef<HTMLButtonElement>(null);

  const [selectedDataToDelete, setSelectedDataToDelete] =
    useState<SelectedItemData | null>(null);

  const calculateAge = (
    birthMonth: number = petInfo.date_of_birth_month,
    birthYear: number = petInfo.date_of_birth_year
  ) => {
    const now = moment();
    const birthday = moment(`${birthYear}-${birthMonth}`, "YYYY-MM");
    const age = now.diff(birthday, "years");
    return age <= 1 ? `${age} year` : `${age} years`;
  };

  useEffect(() => {
    if (isOpenModalAllergies) {
      setCurrentOpenModal("allergies");
    } else if (isOpenModalMedications) {
      setCurrentOpenModal("medications");
    } else if (isOpenModalVaccines) {
      setCurrentOpenModal("vaccines");
    }
  }, [isOpenModalAllergies, isOpenModalMedications, isOpenModalVaccines]);

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
  } = useForm<FormInputs>();

  const [formInputs, setFormInputs] = useState<FormInputs>({
    allergies: {
      allergy: "",
      symptoms: "",
    },
    medications: {
      name: "",
      brand: "",
      dosage: "",
      prescription: "",
    },
    vaccines: {
      name: "",
      type: "",
      clinic: "",
      date: "",
    },
  });

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    set: keyof FormInputs
  ) => {
    let { name, value } = e.target;
    name = name.replace(`${set}.`, "");
    setFormInputs((prevData) => ({
      ...prevData,
      [set]: {
        ...prevData[set],
        [name]: value,
      },
    }));
  };

  const onSubmit: SubmitHandler<FormInputs> = async (inputs: FormInputs) => {


    let errors = 0;

    if (isOpenModalAllergies) {
      if (formInputs.allergies.allergy === "") {
        errors++;
        setError("allergies.allergy", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.allergies.symptoms === "") {
        errors++;
        setError("allergies.symptoms", {
          type: "manual",
          message: "This field is required.",
        });
      }
    } else if (isOpenModalMedications) {
      if (formInputs.medications.name === "") {
        errors++;
        setError("medications.name", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.medications.brand === "") {
        errors++;
        setError("medications.brand", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.medications.dosage === "") {
        errors++;
        setError("medications.dosage", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.medications.prescription === "") {
        errors++;
        setError("medications.prescription", {
          type: "manual",
          message: "This field is required.",
        });
      }
    } else if (isOpenModalVaccines) {
      if (formInputs.vaccines.name === "") {
        errors++;
        setError("vaccines.name", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.vaccines.type === "") {
        errors++;
        setError("vaccines.type", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.vaccines.clinic === "") {
        errors++;
        setError("vaccines.clinic", {
          type: "manual",
          message: "This field is required.",
        });
      }
      if (formInputs.vaccines.date === "") {
        errors++;
        setError("vaccines.date", {
          type: "manual",
          message: "This field is required.",
        });
      }
    }
    if (errors <= 0) {
      if (currentOpenModal === "allergies") {
        axiosPrivate
          .post(`/pet/${petInfo.unique_id}/add/allergies`, formInputs.allergies)
          .then((response) => {
            if (response.data) {
              onCloseModalAllergies();
              petDispatch(changePet(response.data));
              pageDispatch(changePage("home_pet_details", response.data));
              const updatedFormInputs: FormInputs = {
                ...formInputs, // Copy existing petInfo fields
                allergies: {
                  allergy: "",
                  symptoms: "",
                }, // Update allergies field
              };
              setFormInputs(updatedFormInputs);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      if (currentOpenModal === "medications") {
        axiosPrivate
          .post(`/pet/${petInfo.unique_id}/add/medications`, formInputs.medications)
          .then((response) => {
            if (response.data) {
              onCloseModalMedications();
              petDispatch(changePet(response.data));
              pageDispatch(changePage("home_pet_details", response.data));
              const updatedFormInputs: FormInputs = {
                ...formInputs, // Copy existing petInfo fields
                medications: {
                  name: "",
                  brand: "",
                  dosage: "",
                  prescription: "",
                }, // Update allergies field
              };
              setFormInputs(updatedFormInputs);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }


      if (currentOpenModal === "vaccines") {
        axiosPrivate
          .post(`/pet/${petInfo.unique_id}/add/vaccines`, formInputs.vaccines)
          .then((response) => {
            if (response.data) {
              onCloseModalVaccines();
              petDispatch(changePet(response.data));
              pageDispatch(changePage("home_pet_details", response.data));
              const updatedFormInputs: FormInputs = {
                ...formInputs, // Copy existing petInfo fields
                vaccines: {
                  name: "",
                  date: "",
                  clinic: "",
                  type: ""
                }, // Update allergies field
              };
              setFormInputs(updatedFormInputs);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const showAlertDialog = async (index: number, set: string) => {
    setSelectedDataToDelete({ index: index, set: set });
    onOpenAlertDialog();
  };

  const deleteRecord = async () => {
    if (selectedDataToDelete) {
      await deleteInDB(selectedDataToDelete);
    }
  };

  const deleteInDB = async (data: SelectedItemData) => {
    axiosPrivate
      .post(`/pet/${petInfo.unique_id}/medical-info/delete`, data)
      .then((response) => {
        if (response.data) {
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        onCloseAlertDialog();
        if (data.set === "allergies") {
          let array = JSON.parse(petInfo.allergies);
          array.splice(data.index, 1);

          const updatedPetInfo: PetInfo = {
            ...petInfo, // Copy existing petInfo fields
            allergies: JSON.stringify(array), // Update allergies field
          };
          setPetInfo(updatedPetInfo);
          petDispatch(changePet(updatedPetInfo));
          pageDispatch(changePage("home_pet_details", updatedPetInfo));
        }
        if (data.set === "medications") {
          let array = JSON.parse(petInfo.medications);
          array.splice(data.index, 1);

          const updatedPetInfo: PetInfo = {
            ...petInfo, // Copy existing petInfo fields
            medications: JSON.stringify(array), // Update allergies field
          };
          setPetInfo(updatedPetInfo);
          petDispatch(changePet(updatedPetInfo));
          pageDispatch(changePage("home_pet_details", updatedPetInfo));
        }
        if (data.set === "vaccines") {
          let array = JSON.parse(petInfo.vaccines);
          array.splice(data.index, 1);

          const updatedPetInfo: PetInfo = {
            ...petInfo, // Copy existing petInfo fields
            vaccines: JSON.stringify(array), // Update allergies field
          };
          setPetInfo(updatedPetInfo);
          petDispatch(changePet(updatedPetInfo));
          pageDispatch(changePage("home_pet_details", updatedPetInfo));
        }
      });
  };

  useEffect(() => {
    setPetInfo(pageState.pageData as PetInfo);
  }, [pageState]);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex justify-start items-center">
          <h1
            onClick={() => pageDispatch(changePage("home"))}
            className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"
          >
            <FiChevronLeft size={14} className="" /> Back
          </h1>
        </div>
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Pet Details
          </h1>
          <button
            onClick={() =>
              pageDispatch(changePage("home_edit_pet_details", petInfo))
            }
            className="text-xs md:text-sm  text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-2 md:px-5 md:py-3 rounded-full shadow-md  "
          >
            <BiEditAlt size={18} className="inline" /> Edit Details
          </button>
        </div>
        <div className="relative min-h-screen mt-5">
          <div className="relative bg-white mt-5 rounded-2xl shadow-md p-4 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 mt-2 relative">
              <div className="col-span-full relative ">
                <div className="flex items-center justify-center relative">
                  <div className="p-1 border-4 border-amber-400 rounded-full">
                    <img
                      className="inline-block h-40 w-40 rounded-full ring-2 ring-white object-cover "
                      src={`${
                        petInfo.main_picture
                          ? API_URL + petInfo.main_picture
                          : "/assets/no_image.png"
                      }`}
                      alt="Pet Image"
                    />
                  </div>
                </div>

                <div className="bg-green-1000 mt-2 flex flex-col items-center">
                  <h1 className="font-semibold tracking-wide text-center text-gray-600 text-2xl">
                    {petInfo.name}
                  </h1>
                  <h1 className="mt-2 text-wrap text-center w-full ">
                    {petInfo.description ? `"${petInfo.description}"` : ""}
                  </h1>
                  <h1></h1>
                  <div className="mt-5">
                    {/* <h1 className="font-medium text-lg text-center text-gray-400">Characteristics</h1> */}
                    <div
                      className={`grid grid-flow-row-dense grid-cols-2 ${
                        petInfo.behavior != null && petInfo.behavior != ""
                          ? "md:grid-cols-" + petInfo.behavior.split(",").length
                          : ""
                      } grid-rows-2 gap-1`}
                    >
                      {petInfo.behavior != null && petInfo.behavior != "" ? (
                        petInfo.behavior.split(",").map((item) => {
                          return (
                            <span
                              key={item}
                              className="truncate capitalize text-center text-sm md:text-base rounded-full bg-blue-50 px-6 py-1 font-medium text-blue-700 ring-2 ring-inset ring-blue-700/10"
                            >
                              {item}
                            </span>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-full md:col-span-6 mt-3 md:mt-0 relative">
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Microchip ID:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.microchip_id}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 ">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Species:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.pet_type_id == 1 ? "Dog" : "Cat"}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Breed:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.breed}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Age:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{calculateAge()}</h1>
                  </div>
                </div>
              </div>
              <div className="col-span-full md:col-span-6 relative">
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Gender:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>
                      {petInfo.gender.split(" ").length > 1
                        ? petInfo.gender.split(" ")[1]
                        : petInfo.gender}
                    </h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Desexed:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>
                      {petInfo.gender.split(" ").length > 1 ? "Yes" : "No"}
                    </h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Color:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.color}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Weight:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.weight} lbs</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center min-w-full justify-between mt-10">
            <h1 className="text-xl sm:text-2xl tracking-normal font-bold text-gray-700">
              Medical History
            </h1>
            {/* <button onClick={() => onGoing()} className='text-xs lg:text-sm text-white bg-gradient-to-r from-blue-400 to-blue-500 px-5 py-3 rounded-full shadow-md  '>
                    <BiPlus size={18} className='inline'/> Add Record
                </button> */}
          </div>

          <div className="grid grid-cols-12 gap-2 bg-white mt-5 rounded-2xl shadow-md divide-y md:divide-y-0 divide-x-0 md:divide-x ">
            <div className="col-span-full lg:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <BiSolidVirus size={20} className=" text-gray-700" />
                  <h1 className="text-base font-bold text-gray-700">
                    Allergies
                  </h1>
                </div>
                <button
                  onClick={onOpenModalAllergies}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  {" "}
                  Add Record
                </button>
              </div>

              <div className="mt-4">
                {petInfo.allergies != null ? (
                  (JSON.parse(petInfo.allergies) as AllergyInputs[]).length > 0 ? (
                    (JSON.parse(petInfo.allergies) as AllergyInputs[]).map(
                      (item, idx) => {
                        return (
                          <div
                            className="flex flex-row items-center justify-between py-2 mt-1 gap-2"
                            key={idx}
                          >
                            <div className="flex flex-col">
                              <h1 className="text-sm font-bold text-gray-700 capitalize">
                                {item.allergy}
                              </h1>
                              <h1 className="text-xs text-gray-400 capitalize">
                                {item.symptoms}
                              </h1>
                            </div>
                            <div className="flex flex-row gap-1">
                              <button className="rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  ">
                                <BiTrash
                                  size={18}
                                  className=""
                                  onClick={() => {
                                    showAlertDialog(idx, "allergies");
                                  }}
                                />
                              </button>
                              {/* <button className="rounded-full text-xs text-white bg-slate-500 px-1.5 py-1.5 shadow-lg  ">
                                <BiEditAlt size={18} className="" />
                              </button> */}
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="flex items-center justify-center h-16 w-full">
                      <h1 className="text-sm font-semibold text-gray-400">
                        No allergies
                      </h1>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-16 w-full">
                    <h1 className="text-sm font-semibold text-gray-400">
                      No allergies
                    </h1>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-full lg:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <GiMedicines size={22} className=" text-gray-700" />
                  <h1 className="text-base font-bold text-gray-700">
                    Medications
                  </h1>
                </div>
                <button
                  onClick={onOpenModalMedications}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  Add Record
                </button>
              </div>
              <div className="mt-4">

                {petInfo.medications != null ? (
                  (JSON.parse(petInfo.medications) as MedicationInputs[]).length > 0 ? (
                    (JSON.parse(petInfo.medications) as MedicationInputs[]).map(
                      (item, idx) => {
                        return (
                          <div
                            className="flex flex-row items-center justify-between py-2 mt-1 gap-2"
                            key={idx}
                          >
                            <div className="flex flex-col">
                              <h1 className="text-sm font-bold text-gray-700 capitalize">
                                {item.name}, {item.brand}
                              </h1>
                              <h1 className="text-xs text-gray-400 capitalize">
                                {item.dosage}
                              </h1>
                              <h1 className="text-xs text-gray-400 capitalize">
                                {item.prescription}
                              </h1>
                            </div>
                            <div className="flex flex-row gap-1">
                              <button className="rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  ">
                                <BiTrash
                                  size={18}
                                  className=""
                                  onClick={() => {
                                    showAlertDialog(idx, "medications");
                                  }}
                                />
                              </button>
                              {/* <button className="rounded-full text-xs text-white bg-slate-500 px-1.5 py-1.5 shadow-lg  ">
                                <BiEditAlt size={18} className="" />
                              </button> */}
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="flex items-center justify-center h-16 w-full">
                      <h1 className="text-sm font-semibold text-gray-400">
                        No medications
                      </h1>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-16 w-full">
                    <h1 className="text-sm font-semibold text-gray-400">
                      No medications
                    </h1>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-full lg:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <BiSolidInjection
                    size={20}
                    className=" text-gray-700 rotate-180"
                  />
                  <h1 className="text-base font-bold text-gray-700">
                    Vaccines
                  </h1>
                </div>
                <button
                  onClick={onOpenModalVaccines}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  Add Record
                </button>
              </div>
              <div className="mt-4">
                {petInfo.vaccines != null ? (
                  (JSON.parse(petInfo.vaccines) as VaccineInputs[]).length > 0 ? (
                    (JSON.parse(petInfo.vaccines) as VaccineInputs[]).map(
                      (item, idx) => {
                        return (
                          <div
                            className="flex flex-row items-center justify-between py-2 mt-1 gap-2"
                            key={idx}
                          >
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-700 capitalize'>{item.name}, {item.type}</h1>
                                <h1 className='text-xs text-gray-400 capitalize'>{item.clinic}</h1>
                                <h1 className='text-xs text-gray-400'>{moment(item.date).format("LL")}</h1>
                            </div>
                            <div className="flex flex-row gap-1">
                              <button className="rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  ">
                                <BiTrash
                                  size={18}
                                  className=""
                                  onClick={() => {
                                    showAlertDialog(idx, "vaccines");
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="flex items-center justify-center h-16 w-full">
                      <h1 className="text-sm font-semibold text-gray-400">
                        No vaccination records yet.
                      </h1>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-16 w-full">
                    <h1 className="text-sm font-semibold text-gray-400">
                      No vaccination records yet.
                    </h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModalAllergies}
        onClose={onCloseModalAllergies}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent rounded="sm">
            <ModalHeader
              bg="gray.200"
              color="gray.700"
              borderTop="4px"
              borderColor="blue.500"
              className="flex items-center justify-between"
            >
              <Text>Enter your pet's allergy</Text>
              <CloseButton
                rounded="sm"
                color="gray.700"
                onClick={onCloseModalAllergies}
              />
            </ModalHeader>

            <ModalBody pb={6}>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.allergies?.allergy}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Allergy <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="allergies.allergy"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.allergies.allergy}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("allergies.allergy", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("allergies.allergy");
                          }
                          field.onChange(e);
                          onChangeInput(e, "allergies");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.allergies?.allergy &&
                      errors.allergies?.allergy.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-4">
                <FormControl isInvalid={!!errors.allergies?.symptoms}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Symptoms <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="allergies.symptoms"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.allergies.symptoms}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("allergies.symptoms", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("allergies.symptoms");
                          }
                          field.onChange(e);
                          onChangeInput(e, "allergies");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.allergies?.symptoms &&
                      errors.allergies?.symptoms.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
            </ModalBody>

            <ModalFooter className="flex gap-2">
              <Button
                type="submit"
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
              >
                Save
              </Button>
              <Button
                bg="gray.100"
                color="gray.700"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "gray.200" }}
                onClick={onCloseModalAllergies}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModalMedications}
        onClose={onCloseModalMedications}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent rounded="sm">
            <ModalHeader
              bg="gray.200"
              color="gray.700"
              borderTop="4px"
              borderColor="blue.500"
              className="flex items-center justify-between"
            >
              <Text>Enter your pet's medication</Text>
              <CloseButton
                rounded="sm"
                color="gray.700"
                onClick={onCloseModalMedications}
              />
            </ModalHeader>

            <ModalBody pb={6}>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.medications?.name}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Medicine Name <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="medications.name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.medications.name}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("medications.name", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("medications.name");
                          }
                          field.onChange(e);
                          onChangeInput(e, "medications");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.medications?.name &&
                      errors.medications?.name.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.medications?.brand}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Medicine Brand <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="medications.brand"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.medications.brand}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("medications.brand", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("medications.brand");
                          }
                          field.onChange(e);
                          onChangeInput(e, "medications");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.medications?.brand &&
                      errors.medications?.brand.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.medications?.dosage}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Dosage <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="medications.dosage"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.medications.dosage}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("medications.dosage", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("medications.dosage");
                          }
                          field.onChange(e);
                          onChangeInput(e, "medications");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.medications?.dosage &&
                      errors.medications?.dosage.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.medications?.prescription}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Prescription <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="medications.prescription"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.medications.prescription}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("medications.prescription", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("medications.prescription");
                          }
                          field.onChange(e);
                          onChangeInput(e, "medications");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.medications?.prescription &&
                      errors.medications?.prescription.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
            </ModalBody>

            <ModalFooter className="flex gap-2">
              <Button
                type="submit"
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
              >
                Save
              </Button>
              <Button
                bg="gray.100"
                color="gray.700"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "gray.200" }}
                onClick={onCloseModalMedications}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpenModalVaccines}
        onClose={onCloseModalVaccines}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent rounded="sm">
            <ModalHeader
              bg="gray.200"
              color="gray.700"
              borderTop="4px"
              borderColor="blue.500"
              className="flex items-center justify-between"
            >
              <Text>Enter your pet's vaccination record</Text>
              <CloseButton
                rounded="sm"
                color="gray.700"
                onClick={onCloseModalVaccines}
              />
            </ModalHeader>

            <ModalBody pb={6}>
              <div className="mt-4">
                <FormControl isInvalid={!!errors.vaccines?.name}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Vaccine Name <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="vaccines.name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.vaccines.name}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("vaccines.name", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("vaccines.name");
                          }
                          field.onChange(e);
                          onChangeInput(e, "vaccines");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.vaccines?.name &&
                      errors.vaccines?.name.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-4">
                <FormControl isInvalid={!!errors.vaccines?.type}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Vaccination For <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="vaccines.type"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.vaccines.type}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("vaccines.type", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("vaccines.type");
                          }
                          field.onChange(e);
                          onChangeInput(e, "vaccines");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {/* {errors.vaccines?.type && errors.vaccines?.type.message} */}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-4">
                <FormControl isInvalid={!!errors.vaccines?.clinic}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Vaccination Clinic <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="vaccines.clinic"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"text"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.vaccines.clinic}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("vaccines.clinic", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("vaccines.clinic");
                          }
                          field.onChange(e);
                          onChangeInput(e, "vaccines");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.vaccines?.clinic &&
                      errors.vaccines?.clinic.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              <div className="mt-4">
                <FormControl isInvalid={!!errors.vaccines?.date}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Vaccination Date <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="vaccines.date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={"date"}
                        fontSize="sm"
                        size="lg"
                        value={formInputs.vaccines.date}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("vaccines.date", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else {
                            clearErrors("vaccines.date");
                          }
                          field.onChange(e);
                          onChangeInput(e, "vaccines");
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.vaccines?.date &&
                      errors.vaccines?.date.message}
                  </FormErrorMessage>
                </FormControl>
              </div>
            </ModalBody>

            <ModalFooter className="flex gap-2">
              <Button
                type="submit"
                bg="blue.500"
                color="white"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "blue.600" }}
              >
                Save
              </Button>
              <Button
                bg="gray.100"
                color="gray.700"
                fontSize="xs"
                rounded="sm"
                _hover={{ bg: "gray.200" }}
                onClick={onCloseModalVaccines}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <AlertDialog
      isCentered={true}
        isOpen={isOpenAlertDialog}
        leastDestructiveRef={alertDialogCancelRef}
        onClose={onCloseAlertDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Record
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertDialogCancelRef} onClick={onCloseAlertDialog}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteRecord();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PetDetailsPage;
