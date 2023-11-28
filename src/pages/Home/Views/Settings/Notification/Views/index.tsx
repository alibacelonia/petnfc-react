import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, Radio, RadioGroup, Stack, Switch, useToast } from '@chakra-ui/react';
import React, { ChangeEvent, useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { HiBadgeCheck } from 'react-icons/hi';
import { UserInfo } from '../../../../../../flux/user/types';
import { UserInfoContext } from '../../../../../../flux/user/store';
import { axiosPrivate } from '../../../../../../api/axios';


export type Inputs = {
    current_password: string;
    new_password: string;
    confirm_password: string;
  };

const NotificationSettingsPage = () => {

    const {userState, userDispatch} = useContext(UserInfoContext);

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
  } = useForm<Inputs>();

  const [formdata, setFormData] = useState<Inputs>({
    current_password: "",
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

  const validatePasswords = () => {

    clearErrors();
    const fields = ['current_password', 'new_password', 'confirm_password'];
    let error_count = 0

    for(let i of fields){
      if((formdata as any)[i] == ""){
        setError(i as any, { type: 'manual', message:"This is a required field."})
        error_count += 1;
      }
      else if((formdata as any)[i].length < 8){
        setError(i as any, { type: 'manual', message:"Minimum password length is 8 characters."})
        error_count += 1;
      }
    }

    if(error_count == 0) {
        axiosPrivate.post(`/auth/change_password`, formdata).then((response) => {
            handleReset()
            toast({
              position: "top",
              title: "Password Changed Successfully",
              description:
                "Remember to keep your credentials secure and safe.",
              status: "success",
              isClosable: true,
              duration: 3000,
            });
          }).catch((error) => {
            console.error(error)
            if(error.response.data.detail == "Incorrect Password"){
                setError("current_password", { type: 'manual', message: "Incorrect Password."})
            }
            if(error.response.data.detail == "Passwords do not match"){
                setError("confirm_password", { type: 'manual', message: "Passwords do not match."})
            }
          });
      }
      return;
    
  }

  const handleReset = () => {
    clearErrors();
    // Reset the form data state
    setFormData({
      confirm_password: '',
      new_password: '',
      current_password: '',
      // Reset other fields as needed
    });
  };

  const [showCurrent, setCurrent] = useState(false); // Show password variables
  const [showNew, setNew] = useState(false); // Show password variables
  const [showConfirm, setConfirm] = useState(false); // Show password variables

  return (
    <div className="bg-red-0 py-3 px-2">
        <h1 className='text-xl font-bold text-gray-700'>Notification settings</h1>
        <p className='text-sm text-gray-400'>Select the kinds of notifications you get about your activities and recommendations.</p>
        <Divider className='my-4'></Divider>
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-5 bg-blue-1000">
            <h1 className="text-gray-700 font-semibold text-lg">
                Email Notifications
            </h1>
            <p className="text-gray-400 text-sm">
                Get emails to find out what's going on when you're not online. You can turn these off.
            </p>
            </div>
            <div className="col-span-12 lg:col-span-7 bg-red-1000 mt-4 lg:mt-0">
                <form>
                    <div className="flex flex-col ">
                        <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                <h1 className='text-gray-700 font-semibold'>
                                    Pet Monitoring
                                </h1>
                                <p className='text-sm text-gray-400'>Receive Alerts for Every Scan or NFC Tap.</p>
                                </div>
                                <Switch id='pet_monitoring' size="lg"/>
                            </FormControl>
                        </div>
                        <div className="mb-4">
                            <FormControl display='flex' justifyContent="space-between" alignItems='center' gap={4}>
                                <div>
                                    <h1 className='text-gray-700 font-semibold'>
                                        News and Updates
                                    </h1>
                                    <p className='text-sm text-gray-400'>Stay informed about the latest updates on our products, services, app, and exciting new features.</p>
                                </div>
                                <Switch id='news_and_updates' size="lg"/>
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
                </form>
            </div>
        </div>
    </div>
  )
}

export default NotificationSettingsPage
