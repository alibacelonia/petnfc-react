import { AiOutlinePlus } from "react-icons/ai";
import { PetInfo } from "../../../../../../flux/pets/types";
import moment from "moment";
import { PageInfoContext } from "../../../../../../flux/navigation/store";
import React from "react";
import { changePage } from "../../../../../../flux/navigation/action";

interface PetListItemProps {
  data: PetInfo;
}

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function PetListItem({ data }: PetListItemProps) {
  const {pageDispatch} = React.useContext(PageInfoContext)

  const calculateAge = (
    birthMonth: number = data.date_of_birth_month,
    birthYear: number = data.date_of_birth_year
  ) => {
    const now = moment();
    const birthday = moment(`${birthYear}-${birthMonth}`, 'YYYY-MM');
    const age = now.diff(birthday, 'years');
    return age <= 1 ? `${age} year` : `${age} years`;
  };


  const handleClick = (page: string, info: PetInfo) => {
    pageDispatch(changePage(page, info))
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-4 overflow-hidden">
      <div className="absolute -top-2 left-16  bg-gray-50 rounded-full h-10 w-10"></div>
      <div className="absolute -top-20 -right-20  bg-gray-50 rounded-full h-40 w-40"></div>
      <div className="absolute top-20 -left-16 bg-gray-50 rounded-full h-32 w-32"></div>
      <div className="absolute top-28 right-16  bg-gray-50 rounded-full h-6 w-6"></div>
      <div className="absolute top-40 -right-6  bg-gray-50 rounded-full h-12 w-12"></div>
      <div className="absolute -bottom-20 left-12  bg-gray-50 rounded-full h-40 w-40"></div>
      <div className="flex justify-center mt-2">
        <div className="p-1 border-4 border-amber-400 rounded-full">
          <img
              className="inline-block h-28 w-28 rounded-full ring-2 ring-white object-cover "
              src={`${data.main_picture ? API_URL+data.main_picture: "/assets/no_image.png"}`}
              alt="Pet Image"
            />
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <h1 className="font-semibold text-gray-600 text-xl md:text-2xl">{data.name}</h1>
        <h1 className="text-xs text-stone-400">{data.breed}</h1>
      </div>
      <div className="relative grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex flex-col bg-blue-50 rounded-md px-3 py-1.5">
          <h1 className="text-[10px] text-blue-300">Gender</h1>
          <h1 className="text-sm md:text-base text-blue-800">
            {data.gender.split(" ").length > 1
              ? data.gender.split(" ")[1]
              : data.gender}
          </h1>
        </div>
        <div className="col-span-2 flex flex-col bg-blue-50 rounded-md px-3 py-1.5">
          <h1 className="text-[10px] text-blue-300">Age</h1>
          <h1 className="text-sm md:text-base text-blue-800 truncate">{calculateAge()}</h1>
        </div>
        <div className="col-span-2 flex flex-col bg-blue-50 rounded-md px-3 py-1.5">
          <h1 className="text-[10px] text-blue-300">Weight</h1>
          <h1 className="text-sm md:text-base text-blue-800 truncate">{data.weight} lbs</h1>
        </div>
        <div className="col-start-2 col-span-2 flex flex-col bg-blue-50 rounded-md px-3 py-1.5">
          <h1 className="text-[10px] text-blue-300">Desexed</h1>
          <h1 className="text-sm md:text-base text-blue-800">
            {data.gender.split(" ").length > 1 ? "Yes" : "No"}
          </h1>
        </div>
        <div className="col-span-2 flex flex-col bg-blue-50 rounded-md px-3 py-1.5">
          <h1 className="text-[10px] text-blue-300">Color</h1>
          <h1 className="text-sm md:text-base text-blue-800 truncate">{data.color}</h1>
        </div>
      </div>
      <div className="relative border-t border-gray-100 mt-4"></div>
      <div className="relative mt-4 flex gap-2">
        <button
          onClick={() => handleClick("home_edit_pet_details", data)}
          className="transition ease-in-out duration-300 grow px-4 py-2 bg-slate-500 rounded-md text-white text-sm hover:bg-slate-700"
        >
          Edit Details
        </button>
        <button
          onClick={() => handleClick("home_pet_details", data)}
          className="transition ease-in-out duration-300 grow px-4 py-2 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
