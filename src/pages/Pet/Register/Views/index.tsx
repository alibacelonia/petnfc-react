import { useEffect, useState } from "react";
import {
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
} from "chakra-react-select";
import { useLogic } from "./logic";
import { Controller } from "react-hook-form";
import { axiosPrivate } from "../../../../api/axios";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Owner Details",
    description: "Fill up all required information about you.",
  },
  { title: "Step 2 ", description: "Fill up all required information" },
  { title: "Login Details ", description: "Fill up all required information" },
];

const isValidEmail = (email: string): boolean =>{
  const isValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  return isValid
}

const RegisterPetPage = () => {
  const { goToNext, goToPrevious, activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const {
    errors,
    isSubmitting,
    toast,
    control,
    handleSubmit,
    register,
    previewURL,
    petTypes,
    pet_type_id,
    pet_gender,
    pet_birth_month,
    pet_birth_year,
    petCharacteristics,
    selectedBehaviour,
    genders,
    months,
    years,
    StepperIcon,
    onSubmit,
    onChangeSelect,
    onChangeInput,
    handleFileChange,
    onChangeTextArea,
    formdata,
    setFormData,
    chakraStyles,
    setStates,
    trigger,
    selectedCity,
    cities,
    states,
    setError,
    clearErrors
  } = useLogic();


  const navigate = useNavigate();
  const [isDoneChekingEmail, setIsDoneChekingEmail] = useState(true);
  const [isExistEmail, setIsExistEmail] = useState(false)
  const [isExistPhone, setIsExistPhone] = useState(false)

  const checkEmailValidity = async (email: string): Promise<boolean> => {
    if (isValidEmail(formdata.email)) {
      try {
        await axiosPrivate.post(`/user/check/email`, { email: email});
        return true;
      } catch (error) {
        setError("email", {
          type: 'manual',
          message: "The email is already in use. Please choose a different email address."
        });
        return false;
      }
    } else {
      setError("email", {
        type: 'manual',
        message: "Please provide a valid email address."
      });
      return false;
    }
  }

  const checkPhoneValidity = async (phone: string): Promise<boolean> => {
    try {
      await axiosPrivate.post(`/user/check/phone_number`, { phone: phone });
      return true;
    } catch (error) {
      setError("phone_number", {
        type: 'manual',
        message: "The phone number is already in use. Please choose a different phone number."
      });
      return false;
    }
  }
  

  const validateOwnerDetails = async () => {
    const fields = ['firstname', 'lastname', 'email', 'phone_number', 'state', 'city', 'street_address', 'postal_code', 'secondary_contact', 'secondary_contact_number'];
    let error_count = 0

    for(let i of fields){
      if((formdata as any)[i] == ""){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1;
      }
    }
    

    if(error_count == 0 && await checkEmailValidity(formdata.email) && await checkPhoneValidity(formdata.phone_number)) {
      goToNext();
    }
    return;
  }

  const validatePetDetails = async () => {
    
    const fields = ['weight', 'pet_type_id', 'gender', 'name', 'microchip_id', 'breed', 'date_of_birth_year', 'date_of_birth_month', 'color'];
    let error_count = 0

    for(let i of fields){
      if((formdata as any)[i] == "" && i != "weight"){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1
      }
      if(i == "weight"){

        if(formdata.weight < 1){
          setError('weight', {type: 'manual', message: 'Minimum value for this field is 1.'})
        }
      }
      if(selectedBehaviour.length > 5){
        error_count += 1
        setError("behavior", { type: "manual", message: "Please select up to five pet characteristics only."})
      }
    }
    if(error_count > 0) {return;}
    goToNext();
  }


  const validateLoginDetails = async () => {
    const fields = ['password', 'confirm_password'];
    let error_count = 0
    for(let i of fields){
      if((formdata as any)[i] == ""){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1
      }
      else if(formdata.password.length < 8){
        error_count += 1
        setError("password", { type: "manual", message: "Password must be at least 8 characters long."})
      }
      else if(formdata.password != formdata.confirm_password){
        error_count += 1
        setError("confirm_password", { type: "manual", message: "Passwords do not match. Please ensure both passwords are identical."})
      }
    }
    if(error_count > 0) {return;}
    handleSubmit(onSubmit)().then(() => {
      goToNext()
    });
  }


  const [isShownPassword, setShowPassword] = useState(false); // Show password variables
  const showPassword = () => setShowPassword(!isShownPassword); // onClick Show Password Event


  const PageOne = () => {
    return (
      <>
        <div className="relative bg-white mt-5 rounded-2xl p-6 overflow-hidden">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="grid grid-cols-12 gap-3">
                  
                  {/*  First Name */}
                  <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.firstname}>
                      <FormLabel fontSize="sm" color="gray.900" > First Name <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="firstname"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.firstname || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('firstname', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 50){
                                setError('firstname', {type: 'manual', message: 'Firstname cannot be longer than 50 characters'})
                              }
                              else{
                                clearErrors("firstname")
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
                      <FormLabel fontSize="sm" color="gray.900" > Last Name <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="lastname"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.lastname || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('lastname', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 50){
                                setError('lastname', {type: 'manual', message: 'Last name cannot be longer than 50 characters'})
                              }
                              else{
                                clearErrors("lastname")
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
                  <div className="col-span-full md:col-span-6">
                      <FormControl isInvalid={!!errors.email}>
                          <FormLabel fontSize="sm" color="gray.900" > Email Address <span className="text-red-500 text-base">*</span></FormLabel>
                          <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                              <Input
                              {...field}
                              fontSize="sm"
                              size="lg"
                              value={formdata.email || ""}
                              onChange={(e)=>{
                                if(e.target.value == ""){
                                  setError('email', {type: 'manual', message: 'This is a required field.'})
                                }
                                else if(e.target.value.length > 50){
                                  setError('email', {type: 'manual', message: 'Email cannot be longer than 50 characters'})
                                }
                                else{
                                  clearErrors("email")
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
                  </div>
  
                  {/*  Phone Number */}
                  <div className="col-span-full md:col-span-6">
                  <FormControl isInvalid={!!errors.phone_number}>
                      <FormLabel fontSize="sm" color="gray.900" > Phone Number <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="phone_number"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.phone_number || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('phone_number', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 20){
                                setError('phone_number', {type: 'manual', message: 'Phone number cannot be longer than 20 characters'})
                              }
                              else{
                                clearErrors("phone_number")
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
                  </div>
  
  
  
                  {/*  States */}
                  <div className="col-span-full md:col-span-6">
                    <FormControl isInvalid={!!errors.state}>
                      <FormLabel fontSize="sm" color="gray.900" > State <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Select
                            id="state"
                            {...field}
                            options={states}
                            size="lg"
                            chakraStyles={chakraStyles}
                            placeholder="Select state"
                            onChange={(e, a) => {
                              clearErrors("state")
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
                      <FormLabel fontSize="sm" color="gray.900" >Suburb <span className="text-xs text-blue-500 font-light">(Select state first)</span> <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'This is a required field.' }} // Add validation rules if needed
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
                              clearErrors("city")
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
                      <FormLabel fontSize="sm" color="gray.900" > Street Address <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="street_address"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.street_address || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('street_address', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 100){
                                setError('street_address', {type: 'manual', message: 'Street address cannot be longer than 100 characters'})
                              }
                              else{
                                clearErrors("street_address")
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
                      <FormLabel fontSize="sm" color="gray.900" >ZIP / Postal Code <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="postal_code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.postal_code  || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('postal_code', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 10){
                                setError('postal_code', {type: 'manual', message: 'Postal codee cannot be longer than 10 characters'})
                              }
                              else{
                                clearErrors("postal_code")
                              }
                              field.onChange(e);
                              onChangeInput(e)
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
                      <FormLabel fontSize="sm" color="gray.900" >Secondary Contact Person <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="secondary_contact"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.secondary_contact  || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('secondary_contact', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 75){
                                setError('secondary_contact', {type: 'manual', message: 'Secondary contact cannot be longer than 75 characters'})
                              }
                              else{
                                clearErrors("secondary_contact")
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.secondary_contact && errors.secondary_contact.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>
  
  
                  {/*  Color */}
                  <div className="col-span-full md:col-span-6">
                    <FormControl isInvalid={!!errors.secondary_contact_number}>
                      <FormLabel fontSize="sm" color="gray.900" >Phone Number <span className="text-red-500 text-base">*</span></FormLabel>
                      <Controller
                        name="secondary_contact_number"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            fontSize="sm"
                            size="lg"
                            value={formdata.secondary_contact_number  || ""}
                            onChange={(e)=>{
                              if(e.target.value == ""){
                                setError('secondary_contact_number', {type: 'manual', message: 'This is a required field.'})
                              }
                              else if(e.target.value.length > 20){
                                setError('secondary_contact_number', {type: 'manual', message: 'Contact number cannot be longer than 20 characters'})
                              }
                              else{
                                clearErrors("secondary_contact_number")
                              }
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.secondary_contact_number && errors.secondary_contact_number.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>
  
                </div>
              </div>
  
              {/* Cancel and Submit Buttons */}
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  onClick={validateOwnerDetails}
                  type="button"
                  className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
                >
                  Next
                </button>
              </div>
          </div>
      </>
    );
  }

  const PageTwo = () => {
    return (
      <>
      <div className="relative bg-white mt-5 rounded-2xl p-6 overflow-hidden">
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
                    defaultValue={formdata.weight}
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                      {...field}
                      size="lg"
                        value={formdata.weight == 0 ? 0 : field.value}
                        keepWithinRange={true}
                        clampValueOnBlur={false}
                        onChange={(valueString, valueNumber) => {
                          if(Number.isNaN(valueNumber)) {
                            field.onChange("");
                          }
                          else{
                            field.onChange(valueNumber);
                          }


                          if(valueString == ""){
                            setError('weight', {type: 'manual', message: 'This is a required field.'})
                          }
                          else if(valueNumber < 1){
                            setError('weight', {type: 'manual', message: 'Minimum value for this field is 1.'})
                          }
                          else if(valueNumber > 500){
                            setError('weight', {type: 'manual', message: 'Maximum value for this field is 500.'})
                          }
                          else{
                            clearErrors("weight")
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
                        value={pet_type_id}
                        chakraStyles={chakraStyles}
                        placeholder="Select kind of pet"
                        onChange={(e, a) => {
                          clearErrors('pet_type_id');
                          field.onChange(e);
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
                        options={genders}
                        size="lg"
                        value={pet_gender}
                        chakraStyles={chakraStyles}
                        placeholder="Select pet gender"
                        onChange={(e, a) => {
                          clearErrors('gender');
                          field.onChange(e);
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        fontSize="sm"
                        size="lg"
                        value={formdata.name}
                        onChange={(e)=>{
                          if(e.target.value == ""){
                            setError('name', {type: 'manual', message: 'This is a required field.'})
                          }
                          else if(e.target.value.length > 50){
                            setError('name', {type: 'manual', message: 'Name cannot be longer than 50 characters'})
                          }
                          else{
                            clearErrors("name")
                          }
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
                    {...register("microchip_id")}
                    value={formdata.microchip_id  || ""}
                    onChange={(e)=>{

                      if(e.target.value == ""){
                        setError('microchip_id', {type: 'manual', message: 'This is a required field.'})
                      }
                      else if(e.target.value.length > 30){
                        setError('microchip_id', {type: 'manual', message: 'Microchip number cannot be longer than 30 characters'})
                      }
                      else{
                        clearErrors("microchip_id")
                      }
                      onChangeInput(e)
                    }}
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
                    {...register("breed")}
                    value={formdata.breed  || ""}
                    onChange={(e)=>{

                      if(e.target.value == ""){
                        setError('breed', {type: 'manual', message: 'This is a required field.'})
                      }
                      else if(e.target.value.length > 50){
                        setError('breed', {type: 'manual', message: 'Breed cannot be longer than 50 characters'})
                      }
                      else{
                        clearErrors("breed")
                      }
                      onChangeInput(e)
                    }}
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
                        value={pet_birth_year}
                        chakraStyles={chakraStyles}
                        placeholder="Select your pet's birth year"
                        onChange={(e, a) => {
                          clearErrors('date_of_birth_year');
                          field.onChange(e);
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
                        value={pet_birth_month}
                        chakraStyles={chakraStyles}
                        placeholder="Select your pet's birth month"
                        onChange={(e, a) => {
                          clearErrors('date_of_birth_month');
                          field.onChange(e);
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
                    {...register("color")}
                    value={formdata.color  || ""}
                    onChange={(e)=>{

                      if(e.target.value == ""){
                        setError('color', {type: 'manual', message: 'This is a required field.'})
                      }
                      else if(e.target.value.length > 20){
                        setError('color', {type: 'manual', message: 'Color cannot be longer than 20 characters'})
                      }
                      else{
                        clearErrors("color")
                      }
                      onChangeInput(e)
                    }}
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
              onClick={validatePetDetails}
              type="button"
              className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
            >
              Next
            </button>
          </div>
      </div>
      </>
    )
  }

  const PageThree = () => {
    return (
      <>
      <div className="relative bg-white mt-5 rounded-2xl p-6 overflow-hidden">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="grid grid-cols-12 gap-3">
              

              {/* Password */}
              <div className="col-span-full md:col-span-6">
                
              <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontSize="sm" color="gray.900" >Password <span className="text-red-500 text-base">*</span></FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <Input
                          {...field}
                          type={isShownPassword ? "text" : "password"}
                          fontSize="sm"
                          size="lg"
                          value={formdata.password || ""}
                          onChange={(e)=>{
                            if(e.target.value == ""){
                              setError('password', {type: 'manual', message: 'This is a required field.'})
                            }
                            else if(e.target.value.length < 8){

                              setError('password', {type: 'manual', message: 'Password must be at least 8 characters long.'})
                            }
                            else{
                              clearErrors("password")
                            }
                            field.onChange(e);
                            onChangeInput(e);
                          }}
                          
                        />

                        <InputRightElement width="4.5rem" height="100%">
                          <Button h="1.75rem" fontWeight="light" size="xs" onClick={showPassword}>
                            {isShownPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    )}
                  />
                  <FormErrorMessage fontSize="xs">
                  {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
              </div>

              {/* Confirm Password */}
              <div className="col-span-full md:col-span-6">
              <FormControl isInvalid={!!errors.confirm_password}>
                  <FormLabel fontSize="sm" color="gray.900" >Confirm Password <span className="text-red-500 text-base">*</span></FormLabel>
                  <Input
                    type="password"
                    fontSize="sm"
                    size="lg"
                    {...register("confirm_password")}
                    value={formdata.confirm_password  || ""}
                    onChange={(e)=>{
                      if(e.target.value == ""){
                        setError('confirm_password', {type: 'manual', message: 'This is a required field.'})
                      }
                      else{
                        clearErrors("confirm_password")
                      }
                      onChangeInput(e)
                    }}
                  />
                  <FormErrorMessage fontSize="xs">
                    {errors.confirm_password && errors.confirm_password.message}
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
              onClick={validateLoginDetails}
              type="button"
              className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
            >
              Next
            </button>
          </div>
      </div>
      </>
    )
  }

  const PageFour = () => {
    return (
      <>
      <div className="relative bg-white rounded-2xl p-6 overflow-hidden">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-sky-700">Record Added!</h1>
              <p className="text-base text-gray-700 text-center mt-3">Thank you for registering your and your pet's information. </p>
              <p className="text-base text-gray-700  text-center mt-2"> Your details have been successfully recorded.</p>
            </div>
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
            onClick={()=>{
              navigate('/signin', {replace: true});
            }}
              type="button"
              className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
            >
              Proceed to Login
            </button>
          </div>
      </div>
      </>
    )
  }

  

  const pages = [PageOne(), PageTwo(), PageThree(), PageFour()]

  // useEffect(() => {
  //   setActiveStep(0)
  // }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  
  return (
    <>
      <div className="bg-fixed bg-pet-bg bg-repeat bg-top-left bg-16">
        <div className="relative ml-0 backdrop-blur-md bg-white/30 py-4 px-4 md:px-10 z-10 min-h-screen">
          <div className="min-w-screen flex flex-col items-center mt-8 ">
            <div className="px-4 sm:px-20 w-full md:w-5/6 lg:w-4/6  bg-white pt-8 ">
              <Stepper size="md" index={activeStep} colorScheme="blue">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      {
                        <StepStatus
                          complete={StepperIcon[index].complete}
                          incomplete={StepperIcon[index].incomplete}
                          active={StepperIcon[index].active}
                        />
                      }
                    </StepIndicator>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </div>
          </div>
          <div className="flex flex-row justify-center items-start min-h-screen bg-red-00">
            <div className="relative min-h-fit bg-white px-4 md:px-8 py-6 md:py-10 shadow-md w-full md:w-5/6 lg:w-4/6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="post"
                encType="multipart/form-data"
              >
                <>{pages[activeStep]}</>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default RegisterPetPage;
