import moment from "moment";
import { GiMedicines } from "react-icons/gi";
import { BiEditAlt, BiSolidInjection, BiSolidVirus } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { PageInfoContext } from "../../../../../flux/navigation/store";
import { PetInfo } from "../../../../../flux/pets/types";
import { FiChevronLeft } from "react-icons/fi";
import { changePage } from "../../../../../flux/navigation/action";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PetDetailsPage = () => {


  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const pd = pageState.pageData;

  const [petInfo, setPetInfo] = useState<PetInfo>(pd);

  const calculateAge = (
    birthMonth: number = petInfo.date_of_birth_month,
    birthYear: number = petInfo.date_of_birth_year
  ) => {
    const now = moment();
    const birthday = moment(`${birthYear}-${birthMonth}`, "YYYY-MM");
    const age = now.diff(birthday, "years");
    return age <= 1 ? `${age} year` : `${age} years`;
  };


  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex justify-start items-center">
          <h1 onClick={() => pageDispatch(changePage("home"))} className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"><FiChevronLeft size={14} className=""/> Back</h1>
        </div>
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Pet Details
          </h1>
          <button
            onClick={() => pageDispatch(changePage("home_edit_pet_details", petInfo))}
            className="text-xs md:text-sm  text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-2 md:px-5 md:py-3 rounded-full shadow-md  "
          >
            <BiEditAlt size={18} className="inline" /> Edit Details
          </button>
        </div>
        <div className="relative min-h-screen mt-5">
          <div className="relative bg-white mt-5 rounded-2xl shadow-md p-4 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 mt-2 relative">
              <div className="col-span-full relative ">
                <div className="flex items-center justify-center relative">
                  <div className="p-1 border-4 border-amber-400 rounded-full">
                    <img
                      className="inline-block h-40 w-40 rounded-full ring-2 ring-white object-cover "
                      src={`${
                        petInfo.main_picture
                          ? API_URL + petInfo.main_picture
                          : "/assets/no_image.png"
                      }`}
                      alt="Pet Image"
                    />
                  </div>
                </div>

                <div className="bg-green-1000 mt-2 flex flex-col items-center">
                  <h1 className="font-semibold tracking-wide text-center text-gray-600 text-2xl">
                    {petInfo.name}
                  </h1>
                  <h1 className="mt-2 truncate">{petInfo.description ? `"${petInfo.description}"` : ""}</h1>
                  <h1></h1>
                  <div className="mt-5">
                      {/* <h1 className="font-medium text-lg text-center text-gray-400">Characteristics</h1> */}
                      <div className={`grid grid-flow-row-dense grid-cols-2 ${petInfo.behavior != null && petInfo.behavior != "" ? "md:grid-cols-"+petInfo.behavior.split(",").length : ""} grid-rows-2 gap-1`}>
                            
                      {petInfo.behavior != null && petInfo.behavior != "" ?
                        petInfo.behavior.split(",").map((item)=>{
                          return (
                            <span key={item} className="truncate capitalize text-center text-sm md:text-base rounded-full bg-blue-50 px-6 py-1 font-medium text-blue-700 ring-2 ring-inset ring-blue-700/10">
                              {item}
                            </span>
                          )
                        })
                        :
                        <></>
                      }
                      </div>
                  </div>
                </div>
              </div>
              <div className="col-span-full md:col-span-6 mt-3 md:mt-0 relative">
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Microchip ID:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.microchip_id}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 ">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Species:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.pet_type_id == 1 ? "Dog" : "Cat"}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Breed:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.breed}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Age:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{calculateAge()}</h1>
                  </div>
                </div>
              </div>
              <div className="col-span-full md:col-span-6 relative">
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Gender:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>
                      {petInfo.gender.split(" ").length > 1
                        ? petInfo.gender.split(" ")[1]
                        : petInfo.gender}
                    </h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Desexed:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>
                      {petInfo.gender.split(" ").length > 1 ? "Yes" : "No"}
                    </h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12 bg-gray-50">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Color:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.color}</h1>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-12">
                  <div className="col-start-2 col-span-4 text-gray-700 py-4">
                    <h1>Weight:</h1>
                  </div>
                  <div className="col-span-6 font-bold text-gray-700 py-4">
                    <h1>{petInfo.weight} lbs</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center min-w-full justify-between mt-10">
            <h1 className="text-xl sm:text-2xl tracking-normal font-bold text-gray-700">
              Medical History
            </h1>
            {/* <button onClick={() => onGoing()} className='text-xs lg:text-sm text-white bg-gradient-to-r from-blue-400 to-blue-500 px-5 py-3 rounded-full shadow-md  '>
                    <BiPlus size={18} className='inline'/> Add Record
                </button> */}
          </div>

          <div className="grid grid-cols-12 gap-2 bg-white mt-5 rounded-2xl shadow-md divide-y md:divide-y-0 divide-x-0 md:divide-x ">
            <div className="col-span-full md:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <BiSolidVirus size={20} className=" text-gray-700" />
                  <h1 className="text-base font-bold text-gray-700">
                    Allergies
                  </h1>
                </div>
                <button
                  // onClick={() => onGoing()}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  Add Record
                </button>
              </div>

              <div className="mt-4">
                {/* <div className='flex flex-row items-center justify-between py-2 mt-1'>
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-700'>Pollen</h1>
                                <h1 className='text-xs text-gray-400'>Itchy nose and watery eyes</h1>
                            </div>
                            <div className='flex flex-row gap-1'>
                                <button className='rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  '>
                                    <BiTrash size={18} className=''/>
                                </button>
                                <button className='rounded-full text-xs text-white bg-slate-500 px-1.5 py-1.5 shadow-lg  '>
                                    <BiEditAlt size={18} className=''/>
                                </button>
                            </div>
                        </div> */}

                <div className="flex items-center justify-center h-16 w-full">
                  <h1 className="text-sm font-semibold text-gray-400">
                    No allergies
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-span-full md:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <GiMedicines size={22} className=" text-gray-700" />
                  <h1 className="text-base font-bold text-gray-700">
                    Medications
                  </h1>
                </div>
                <button
                  // onClick={() => onGoing()}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  Add Record
                </button>
              </div>
              <div className="mt-4">
                {/* <div className='flex flex-row items-center justify-between py-2 mt-1'>
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-700'>Ridocane</h1>
                                <h1 className='text-xs text-gray-400'>250 mg</h1>
                                <h1 className='text-xs text-gray-400'>3 times a day</h1>
                            </div>
                            <div className='flex flex-row gap-1'>
                                <button className='rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  '>
                                    <BiTrash size={18} className=''/>
                                </button>
                                <button className='rounded-full text-xs text-white bg-slate-500 px-1.5 py-1.5 shadow-lg  '>
                                    <BiEditAlt size={18} className=''/>
                                </button>
                            </div>
                        </div> */}

                <div className="flex items-center justify-center h-16 w-full">
                  <h1 className="text-sm font-semibold text-gray-400">
                    No medications
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-span-full md:col-span-4 p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1">
                  <BiSolidInjection
                    size={20}
                    className=" text-gray-700 rotate-180"
                  />
                  <h1 className="text-base font-bold text-gray-700">
                    Vaccines
                  </h1>
                </div>
                <button
                  // onClick={() => onGoing()}
                  className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1.5 rounded-full shadow-md  "
                >
                  Add Record
                </button>
              </div>
              <div className="mt-4">
                {/* <div className='flex flex-row items-center justify-between py-2 mt-1'>
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-700'>Rabbies</h1>
                                <h1 className='text-xs text-gray-400'>Montana General Hospital</h1>
                                <h1 className='text-xs text-gray-400'>March 12, 2022</h1>
                            </div>
                            <div className='flex flex-row gap-1'>
                                <button className='rounded-full text-xs text-white bg-red-400 px-1.5 py-1.5 shadow-lg  '>
                                    <BiTrash size={18} className=''/>
                                </button>
                                <button className='rounded-full text-xs text-white bg-slate-500 px-1.5 py-1.5 shadow-lg  '>
                                    <BiEditAlt size={18} className=''/>
                                </button>
                            </div>
                        </div> */}

                <div className="flex items-center justify-center h-16 w-full">
                  <h1 className="text-sm font-semibold text-gray-400">
                    No vaccinations yet
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetDetailsPage;
