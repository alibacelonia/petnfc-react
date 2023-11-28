import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import { UserInfo } from "../../../../../flux/user/types";
import { UserInfoContext } from "../../../../../flux/user/store";
import { ActionMeta, ChakraStylesConfig, Select } from "chakra-react-select";
import { FormControl, FormErrorMessage, FormLabel, Input, useToast } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { axiosPrivate } from "../../../../../api/axios";
import { changePage } from "../../../../../flux/navigation/action";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import { changeUser } from "../../../../../flux/user/action";

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
};

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
interface MyObject {
  [key: string]: any;
}

const ProfileEditPage = () => {
  const {userState, userDispatch} = useContext(UserInfoContext);
  const {pageState, pageDispatch} = React.useContext(PageInfoContext)
  const pd = pageState.pageData;
  const [formdata, setFormData] = useState<UserInfo>(pd);


  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState<object | null>(null);
  const [selectedCity, setSelectedCity] = useState<object | null>(null);


  const filterChanges = (original: MyObject, updated: MyObject) => {
    let changedKeys: MyObject = {};

    for (let key in original) {
      if (original[key] !== updated[key]) {
        changedKeys[key] = updated[key];
      }
    }

    return changedKeys;
  };

  const validateOwnerDetails = async () => {
    const fields = ['firstname', 'lastname', 'email', 'phone_number', 'state', 'city', 'street_address', 'postal_code', 'secondary_contact', 'secondary_contact_number'];
    let error_count = 0

    for(let i of fields){
      if((formdata as any)[i] == ""){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1;
      }
    }
    

    if(error_count == 0) {
      const changes = filterChanges(pd, formdata);
      const keys = Object.keys(changes);
      if(keys.length > 0){
        axiosPrivate.post(`/user/update`, changes).then((response) => {
          userDispatch(changeUser(response.data));
          pageDispatch(changePage("profile"))
        }).catch((error) => {
          toast({
            position: "top",
            title: "Update Failed",
            description:
              "Unable to your details as there are errors detected",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        });
      }
      else{
        toast({
          position: "top",
          title: "No Changes Found",
          description:
            "Unable to your details as there are no changes detected",
          status: "warning",
          isClosable: true,
          duration: 3000,
        });
      }
    }
    return;
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name;
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };


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
    clearErrors
  } = useForm<Inputs>();


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
    }
  };
  
  useEffect(() => {
    axiosPrivate.get("/state/country/AU/states").then((response) => {
      setStates(response.data)
      setSelectedState(response.data.filter((type: any) => {
        return type["value"] == formdata.state_code
      }))
    });

    if((formdata.city != null && formdata.state != null)){
      axiosPrivate.get(`/city/state/${formdata.state_code}/cities`).then((response) => {
        setCities(response.data)
        setSelectedCity(response.data.filter((type: any) => {
          return type["value"] == formdata.city_code
        }))
      });
    }


    console.log(formdata);
    
  }, []);  

  return (
    <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
      <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
           Edit Profile
          </h1>
        </div>
      <form>
        <div className="relative bg-white mt-5 rounded-2xl px-6 py-10 md:px-10 md:py-12 overflow-hidden">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="grid grid-cols-12 gap-3">
              {/*  First Name */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.firstname}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    First Name <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="firstname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.firstname || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("firstname", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 50) {
                            setError("firstname", {
                              type: "manual",
                              message:
                                "Firstname cannot be longer than 50 characters",
                            });
                          } else {
                            clearErrors("firstname");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.firstname && errors.firstname.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  Last Name */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.lastname}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    Last Name <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="lastname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.lastname || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("lastname", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 50) {
                            setError("lastname", {
                              type: "manual",
                              message:
                                "Last name cannot be longer than 50 characters",
                            });
                          } else {
                            clearErrors("lastname");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.lastname && errors.lastname.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  Email Address */}
              {/* <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    Email Address{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                  disabled
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.email || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("email", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 50) {
                            setError("email", {
                              type: "manual",
                              message:
                                "Email cannot be longer than 50 characters",
                            });
                          } else {
                            clearErrors("email");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
              </div> */}

              {/*  Phone Number */}
              {/* <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.phone_number}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    Phone Number{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="phone_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.phone_number || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("phone_number", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 20) {
                            setError("phone_number", {
                              type: "manual",
                              message:
                                "Phone number cannot be longer than 20 characters",
                            });
                          } else {
                            clearErrors("phone_number");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.phone_number && errors.phone_number.message}
                  </FormErrorMessage>
                </FormControl>
              </div> */}

              {/*  States */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.state}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    State <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="state"
                        {...field}
                        options={states}
                        size="lg"
                        value={selectedState}
                        chakraStyles={chakraStyles}
                        placeholder="Select state"
                        onChange={(e, a) => {
                          clearErrors("state");
                          field.onChange(e);
                          onChangeSelect(e, a);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.state && errors.state.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/* Suburb */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.city}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Suburb{" "}
                    <span className="text-xs text-blue-500 font-light">
                      (Select state first)
                    </span>{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "This is a required field." }} // Add validation rules if needed
                    render={({ field }) => (
                      <Select
                        id="city"
                        {...field}
                        options={cities}
                        size="lg"
                        chakraStyles={chakraStyles}
                        value={selectedCity}
                        placeholder="Select suburb"
                        onChange={(e, a) => {
                          clearErrors("city");
                          field.onChange(e);
                          // Add your additional onChange logic here
                          // For example, you can call your custom onChangeSelect function if needed
                          onChangeSelect(e, a);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.city && errors.city.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  Street Address */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.street_address}>
                  <FormLabel fontSize="sm" color="gray.900">
                    {" "}
                    Street Address{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="street_address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.street_address || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("street_address", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 100) {
                            setError("street_address", {
                              type: "manual",
                              message:
                                "Street address cannot be longer than 100 characters",
                            });
                          } else {
                            clearErrors("street_address");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.street_address && errors.street_address.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  ZIP / Postal Code */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.postal_code}>
                  <FormLabel fontSize="sm" color="gray.900">
                    ZIP / Postal Code{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="postal_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.postal_code || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("postal_code", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 10) {
                            setError("postal_code", {
                              type: "manual",
                              message:
                                "Postal codee cannot be longer than 10 characters",
                            });
                          } else {
                            clearErrors("postal_code");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.postal_code && errors.postal_code.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  Secondary Contact Person */}
              <div className="col-span-full md:col-span-6 sm:col-start-1">
                <FormControl isInvalid={!!errors.secondary_contact}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Secondary Contact Person{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="secondary_contact"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.secondary_contact || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("secondary_contact", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 75) {
                            setError("secondary_contact", {
                              type: "manual",
                              message:
                                "Secondary contact cannot be longer than 75 characters",
                            });
                          } else {
                            clearErrors("secondary_contact");
                          }
                          field.onChange(e);
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.secondary_contact &&
                      errors.secondary_contact.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/*  Color */}
              <div className="col-span-full md:col-span-6">
                <FormControl isInvalid={!!errors.secondary_contact_number}>
                  <FormLabel fontSize="sm" color="gray.900">
                    Phone Number{" "}
                    <span className="text-red-500 text-base">*</span>
                  </FormLabel>
                  <Controller
                    name="secondary_contact_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.secondary_contact_number || ""}
                        onChange={(e) => {
                          if (e.target.value == "") {
                            setError("secondary_contact_number", {
                              type: "manual",
                              message: "This is a required field.",
                            });
                          } else if (e.target.value.length > 20) {
                            setError("secondary_contact_number", {
                              type: "manual",
                              message:
                                "Contact number cannot be longer than 20 characters",
                            });
                          } else {
                            clearErrors("secondary_contact_number");
                          }
                          onChangeInput(e);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.secondary_contact_number &&
                      errors.secondary_contact_number.message}
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
                  pageDispatch(changePage("profile"))
                }
                className="text-xs lg:text-sm text-gray-700  bg-gray-200 px-8 py-3 rounded-md shadow-md  hover:bg-gray-300 transition duration-150 ease-out"
              >
                Back
              </button>
            <button
              onClick={validateOwnerDetails}
              type="button"
              className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;
