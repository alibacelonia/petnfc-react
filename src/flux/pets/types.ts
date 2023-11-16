export type PetInfo = {
    id: number;
    owner_id: string;
    name: string;
    breed: string;
    pet_type_id: number;
    microchip_id: string;
    unique_id: string;
    main_picture: string;
    color: string;
    gender: string;
    date_of_birth_year: number;
    date_of_birth_month: number;
    weight: number;
    behavior: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export type PetRegisterInfo = {
    
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

    owner_id: string;
    name: string;
    breed: string;
    pet_type_id: number;
    microchip_id: string;
    unique_id: string;
    main_picture: string;
    color: string;
    gender: string;
    date_of_birth_year: number;
    date_of_birth_month: number;
    weight: number;
    behavior: string;
    description: string;

    password:string;
    confirm_password:string;
}

export type PetInfoContextState = {
    petInfos: PetInfo[];
    history: PetAction[];
}

export enum PetActionType {
    FETCH_DATA = "FETCH_DATA",
    ADD_PET = "ADD_PET",
    UPDATE_PET = "UPDATE_PET"
}

export type PetActionPayload = {
    targetPetInfo?: PetInfo;
    targetPetInfos?: PetInfo[]
}

export type PetAction = {
    type: PetActionType
    payload?: PetActionPayload
}

export type PetContextType = {
    petState: PetInfoContextState
    petDispatch: React.Dispatch<PetAction>
}