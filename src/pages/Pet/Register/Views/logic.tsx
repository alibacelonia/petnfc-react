import { ChangeEvent, useEffect, useState } from "react";
import { FaLock, FaPaw, FaUser } from "react-icons/fa";
import axios, { axiosPrivate } from "../../../../api/axios";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ActionMeta,
  ChakraStylesConfig,
  OptionBase,
} from "chakra-react-select";
import moment from "moment";
import { useSteps, useToast } from "@chakra-ui/react";
import { PetInfo, PetRegisterInfo } from "../../../../flux/pets/types";
import { useNavigate, useParams } from "react-router-dom";


const API_URL = process.env.REACT_APP_BACKEND_URL;

export interface BehaviorOption extends OptionBase {
    label: string;
    value: string;
  }
  
  export type Inputs = {
    firstname: string;
    lastname: string;
    email: string;
    street_address: string;
    postal_code: string;
    city_code: string;
    city: string;
    state_code: string;
    state: string;
    country_code: string;
    country: string;
    phone_number: string;
    secondary_contact: string;
    secondary_contact_number: string;

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

    password:string;
    confirm_password:string;
  };

export const useLogic = () => {

interface ValueLabelPair {
  value: number;
  label: string;
  isDisabled: boolean;
}

const steps = [
  {
    title: "Owner Details",
    description: "Fill up all required information about you.",
  },
  { title: "Step 2 ", description: "Fill up all required information" },
  { title: "Login Details ", description: "Fill up all required information" },
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

const genders = [
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


  const toast = useToast();
  const { id } = useParams<{ id: string | undefined }>();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    setValue,
    setError,
    clearErrors
  } = useForm<Inputs>();

  const [petTypes, setPetTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [pet_type_id, setPetTypeID] = useState<object | null>(null);
  const [pet_gender, setPetGender] = useState<object | null>(null);
  const [pet_birth_year, setPetBirthYear] = useState<object | null>(null);
  const [pet_birth_month, setPetBirthMonth] = useState<object | null>(null);
  const [selectedState, setSelectedState] = useState<object | null>(null);
  const [selectedCity, setSelectedCity] = useState<object | null>(null);
  const [selectedBehaviour, setSelectedBehaviour] = useState<BehaviorOption[]>(
    []
  );

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formdata, setFormData] = useState<PetRegisterInfo>({
    firstname: "",
    lastname: "",
    email: "",
    photo: "",
    street_address: "",
    postal_code: "",
    city_code: "",
    city: "",
    state_code: "",
    state: "",
    country_code: "",
    country: "",
    phone_number: "",
    secondary_contact: "",
    secondary_contact_number: "",
    verified: false,
    verification_code: "",
    role: "user",

    owner_id: "",
    name: "",
    breed: "",
    pet_type_id: 0,
    microchip_id: "",
    unique_id: id || "",
    main_picture: "",
    color: "",
    gender: "",
    date_of_birth_year: 0,
    date_of_birth_month: 0,
    weight: 0,
    behavior: "",
    description: "",

    password:"",
    confirm_password:"",
  });

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
  };

  const onChangeSelect = (newValue: unknown, action: ActionMeta<unknown>) => {
    // const onChangeSelect = (newValue: unknown) => {
    if (typeof newValue === "object") {
      // Now we know myObject is an object
      console.info(`newValue: `, newValue);
      console.info(`action: `, action);
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
          genders.filter((type) => {
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
        if(newData.length > 5){
          setError("behavior", { type: "manual", message: "Please select up to five pet characteristics only."})
        }
        else{
          clearErrors("behavior")
        }
        let behaviors = (newData as BehaviorOption[])
          .map((item) => item.value)
          .join(",");

        setFormData((prevData) => ({
          ...prevData,
          [key]: behaviors,
        }));
      }

      if (key === "state") {
        setFormData((prevData) => ({
          ...prevData,
          "state": newData.label,
          "state_code": newData.value,

          "city": "",
          "city_code": ""
        }));

        setSelectedState(
          states.filter((type) => {
            return type["value"] == newData.value;
          })
        );
        setSelectedCity(null)
        axiosPrivate.get(`/city/state/${newData.value}/cities`).then((response) => {
            setCities(response.data)
        });
      }


      if (key === "city") {
        setFormData((prevData) => ({
          ...prevData,
          "city": newData.label,
          "city_code": newData.value
        }));
        setSelectedCity(
          cities.filter((type) => {
            return type["value"] == newData.value;
          })
        );
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
        main_picture: formdata.main_picture,
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
        main_picture: formdata.main_picture,
      }));
      setPreviewURL(null);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    console.info("formdata: ", formdata);
    if (file != null) {
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
        .post(`/pet/register`, formDataWithFile, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
        .then((response) => {
          console.info("response: ", response);
          //   petDispatch(addPet(response.data));
          //   pageDispatch(changePage("home_pet_details", response.data))
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axiosPrivate
        .put(`/pet/register/`, formdata)
        .then((response) => {

          console.info("response: ", response);
          //   petDispatch(addPet(response.data));
          //   pageDispatch(changePage("home_pet_details", response.data))
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const StepperIcon = [
    {
      complete: <FaUser className="text-slate-100" />,
      incomplete: <FaUser className="text-slate-700" />,
      active: <FaUser className="text-sky-700" />,
    },
    {
      complete: <FaPaw size={18} className="text-slate-100" />,
      incomplete: <FaPaw size={18} className="text-slate-300" />,
      active: <FaPaw size={18} className="text-sky-700" />,
    },
    {
      complete: <FaLock size={18} className="text-slate-100" />,
      incomplete: <FaLock size={18} className="text-slate-300" />,
      active: <FaLock size={18} className="text-sky-700" />,
    },
  ];


  useEffect(() => {
    axiosPrivate.get("/state/country/AU/states").then((response) => {
        setStates(response.data)
    });

    axiosPrivate.get("/pet/pet-types").then((response) => {
      setPetTypes(response.data);
    });
    console.log(formdata);
    
  }, []);  

  // useEffect(() => {
  //   // Check if id is undefined before validating
  //   if (id === undefined || !isValidUUID(id)) {
  //     navigate('/', { replace: true });
  //   }
  //   else{
  //     axiosPrivate.get(`/pet/${id}`).catch(() =>{
  //       navigate('/', { replace: true });
  //     });
  //   }
  //   // Fetch data or perform other actions using the valid UUID
  //   // fetchData(id);
  // }, [id]);

  return {
    errors, 
    isSubmitting,
    toast,
    control,
    trigger,
    reset,
    setValue,
    handleSubmit,
    register,
    previewURL,
    petTypes,
    setPetTypes,
    pet_type_id,
    pet_gender,
    pet_birth_month,
    pet_birth_year,
    petCharacteristics,
    selectedBehaviour,
    cities,
    setCities,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    genders,
    months,
    years,
    steps,
    states, 
    setStates,
    StepperIcon,
    onSubmit,
    onChangeSelect,
    onChangeInput,
    handleFileChange,
    onChangeTextArea,
    formdata,
    setFormData,
    chakraStyles,
    setError,
    clearErrors
  };
};
