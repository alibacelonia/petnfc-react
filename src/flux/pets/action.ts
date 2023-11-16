import { PetAction, PetActionType, PetInfo } from "./types"

export const fetchPetData = (petInfos: PetInfo[]): PetAction =>{
    return {
        type: PetActionType.FETCH_DATA,
        payload: {
            targetPetInfos: [...petInfos]
        }
    }
}

export const addPet = (petInfo: PetInfo): PetAction => {
    return {
        type: PetActionType.ADD_PET,
        payload: {
            targetPetInfo: petInfo
        }
    }
}
export const changePet = (petInfo: PetInfo): PetAction => {
    return {
        type: PetActionType.UPDATE_PET,
        payload: {
            targetPetInfo: petInfo
        }
    }
}