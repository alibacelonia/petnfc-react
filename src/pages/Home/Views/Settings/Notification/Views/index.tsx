import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiBadgeCheck } from "react-icons/hi";
import { UserInfo } from "../../../../../../flux/user/types";
import { UserInfoContext } from "../../../../../../flux/user/store";
import { axiosPrivate } from "../../../../../../api/axios";
import { useSettings } from "../../../../../../hooks/useSettings";
import { updateUser } from "../../../../../../flux/user/action";

export type Inputs = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const NotificationSettingsPage = () => {
  const { userState, userDispatch } = useContext(UserInfoContext);
  const [userInfo, setUserInfo] = useState<UserInfo>(userState.userInfo);

  const [settings, updateSettings] = useSettings();

  const saveSettingsChanges = async () => {
    axiosPrivate.post(`/user/update-settings`, settings)
    .then((response) => {
      if(response.data){
        userDispatch(updateUser(response.data))
      }
    })
    .catch((error) => { 
      console.log(error); 
    });
  }

  const handleToggleNotificationSetting = (settingName: 'petMonitoring' | 'newAndUpdates') => {
    const updatedSettings = { ...settings };
    // Toggle the specified privacy setting
    updatedSettings.notification.email[settingName] = !updatedSettings.notification.email[settingName];
    updateSettings(updatedSettings);
    saveSettingsChanges()
    
};

  return (
    <div className="bg-red-0 py-3 px-2">
      <h1 className="text-xl font-bold text-gray-700">Notification settings</h1>
      <p className="text-sm text-gray-400">
        Select the kinds of notifications you get about your activities and
        recommendations.
      </p>
      <Divider className="my-4"></Divider>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 bg-blue-1000">
          <h1 className="text-gray-700 font-semibold text-lg">
            Email Notifications
          </h1>
          <p className="text-gray-400 text-sm">
            Get emails to find out what's going on when you're not online. You
            can turn these off.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-7 bg-red-1000 mt-4 lg:mt-0">
            <div className="flex flex-col ">
              <div className="mb-4">
                <FormControl
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={4}
                >
                  <div>
                    <h1 className="text-gray-700 font-semibold">
                      Pet Monitoring
                    </h1>
                    <p className="text-sm text-gray-400">
                      Receive Alerts for Every Scan or NFC Tap.
                    </p>
                  </div>
                  <Switch id="pet_monitoring" size="lg" isChecked={settings.notification.email.petMonitoring} onChange={()=>{
                    handleToggleNotificationSetting('petMonitoring')
                  }}/>
                </FormControl>
              </div>
              <div className="mb-4">
                <FormControl
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={4}
                >
                  <div>
                    <h1 className="text-gray-700 font-semibold">
                      News and Updates
                    </h1>
                    <p className="text-sm text-gray-400">
                      Stay informed about the latest updates on our products,
                      services, app, and exciting new features.
                    </p>
                  </div>
                  <Switch id="news_and_updates" size="lg" isChecked={settings.notification.email.newAndUpdates} onChange={()=>{
                    handleToggleNotificationSetting('newAndUpdates')
                  }}/>
                </FormControl>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
