// hooks/useSettings.ts

import { useContext, useEffect, useState } from 'react';
import { AppSettings } from '../model/AppSettings';
import { UserInfoContext } from '../flux/user/store';

export const useSettings = (): [AppSettings, (updatedSettings: AppSettings) => void] => {
    const { userState } = useContext(UserInfoContext);
    const [settings, setSettings] = useState(userState.userInfo.settings || new AppSettings());

    const updateSettings = (updatedSettings: AppSettings) => {
        setSettings(updatedSettings);
    };

    useEffect(() => {
        if(userState.userInfo.settings){
            setSettings(userState.userInfo.settings)
        }
    }, [userState]);

    return [settings, updateSettings];
};
