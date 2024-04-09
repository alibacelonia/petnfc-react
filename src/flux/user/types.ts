interface AccountSettings {
    emailAddress: string;
    privacy: {
        contact: {
            visible: boolean;
        };
        medical: {
            allergies: boolean;
            medications: boolean;
            vaccinations: boolean;
        };
    };
}

interface EmailNotificationSettings {
    petMonitoring: boolean;
    newAndUpdates: boolean;
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
    type: string;
    recipient: string;
}

interface AppSettings {
    account: AccountSettings;
    notification: {
        email: EmailNotificationSettings;
    };
    security: SecuritySettings;
}


export type UserInfo = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    photo: null | string;
    street_address: string;
    postal_code: string;
    city_code: string;
    city: string;
    state_code: string;
    state: string;
    country_code: null | string;
    country: null | string;
    phone_number: string;
    secondary_contact: string;
    secondary_contact_number: string;
    verified: boolean;
    verification_code: null | string;
    role: string;
    created_at: string;
    updated_at: string;

    otp: string;
    otp_secret: string;
    otp_created_at: string;

    status: string;
    settings: null | AppSettings;
}


export type UserInfoContextState = {
    userInfo: UserInfo;
    history: UserAction[];
}

export enum UserActionType {
    FETCH_DATA = "FETCH_DATA",
    UPDATE_PET = "UPDATE_PET",
    UPDATE_USER = "UPDATE_USER"
}

export type UserActionPayload = {
    targetUserInfo?: UserInfo;
}

export type UserAction = {
    type: UserActionType
    payload?: UserActionPayload
}

export type UserContextType = {
    userState: UserInfoContextState
    userDispatch: React.Dispatch<UserAction>
}