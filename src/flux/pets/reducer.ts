import { PetInfoContextState, PetAction, PetActionType } from "./types"

export const reducer = (
    state: PetInfoContextState,
    action: PetAction
): PetInfoContextState => {
    switch (action.type) {
        case PetActionType.FETCH_DATA:
            return action.payload?.targetPetInfos ? {
                ...state,
                petInfos: [...action.payload.targetPetInfos],
                history: [...state.history, action],
            } : state
        
        case PetActionType.ADD_PET:
            return action.payload?.targetPetInfo ? {
                ...state,
                petInfos: [...state.petInfos, action.payload.targetPetInfo],
                history: [...state.history, action],
            }: state

        case PetActionType.UPDATE_PET:
            const updatedPet = action.payload?.targetPetInfo;

            if (!updatedPet){
                return state
            }

            const petInfos = state.petInfos.map(petInfo => petInfo.id === updatedPet.id ? updatedPet : petInfo);

            return {
                ...state,
                petInfos: petInfos,
                history: [...state.history, action],
            }

        // Add a default case to handle other action types
        default:
            return state;
    }
}
