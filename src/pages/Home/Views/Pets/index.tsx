import PetCardList from "./PetList";
import { FiPlus } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { PetInfoContext } from "../../../../flux/pets/store";
import { PetInfo } from "../../../../flux/pets/types";
import { PageInfoContext } from "../../../../flux/navigation/store";
import { changePage } from "../../../../flux/navigation/action";

const noPets = () => {
  return (
    <>
      <div className="mt-4 bg-red-1000 relative h-96 min-w-full flex items-center justify-center">
        <h1>No registered pets yet.</h1>
      </div>
    </>
  );
};

const PetsPage = () => {
  const {pageDispatch} = React.useContext(PageInfoContext)
  const {petState,} = React.useContext(PetInfoContext)
  const petInfos = petState.petInfos

  const [pets, setPets] = useState<PetInfo[]>(petInfos);

  useEffect(() => {
    setPets(petState.petInfos)
  }, [petInfos]);

  return (
    <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            My Pets
          </h1>
          <button
            onClick={() => pageDispatch(changePage("home_register_pet"))}
            className="text-xs md:text-sm  text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-2 md:px-5 md:py-3 rounded-full shadow-md  "
          >
            <FiPlus size={16} className="inline" /> Register Pet
          </button>
        </div>
        {pets.length > 0 ? <PetCardList data={pets} /> : noPets()}
    </div>
  );
};

export default PetsPage;
