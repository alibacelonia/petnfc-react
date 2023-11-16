import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { axiosPrivate } from '../../../../api/axios';
import { HiOutlineDeviceMobile, HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhoneOutgoing } from 'react-icons/hi';
import { MdOutlineWhatsapp } from 'react-icons/md';
const API_URL = process.env.REACT_APP_BACKEND_URL;
const PetPublicDetailsPage = () => {

  const { id } = useParams<{ id: string | undefined }>();
  const [petInfo, setPetInfo] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axiosPrivate.get(`/pet/${id}`).then((response) => {
      console.info(response.data);
      setPetInfo(response.data)
    }).finally(() => {
      setIsLoading(false);
    })
  }, []);

  return (
      isLoading ? 
      <></>
      :
      <>
      <div
        className="bg-fixed bg-pet-bg bg-repeat bg-top-left bg-16"
      ><div className="relative ml-0 backdrop-blur-sm bg-white/30 py-4 md:px-10 z-10 min-h-screen  grid place-items-center px-2 ">
        <div className="mt-12 mb-4">
          <img
            className="object-cover h-44 w-44 sm:h-60 sm:w-60 rounded-full ring-2 ring-offset-2 mb-8 ring-slate-300"
            src={`${
              (petInfo as any).pet.main_picture
                ? API_URL + (petInfo as any).pet.main_picture
                : "/assets/no_image.png"
            }`}
            alt="Pet Image"

            // onClick={handleImageClick}
          />
          <h1 className="text-3xl font-bold tracking-wider text-center text-sky-700">
            {(petInfo as any)["pet"]["name"].toUpperCase()}
          </h1>
          <h1 className="text-base  text-gray-700 tracking-wider text-center">
            {(petInfo as any)["pet"]["breed"]}
          </h1>
        </div>
        <div className="flex flex-row gap-5 mb-5">
          <a href={`mailto:${(petInfo as any)["owner"]["email"]}`}>
            <div className="bg-white p-3 shadow-md rounded-full">
              <HiOutlineMail
                size={32}
                className="text-slate-600"
              ></HiOutlineMail>
            </div>
          </a>

          <a href={`tel:${(petInfo as any)["owner"]["phone_number"]}`}>
            <div className="bg-white p-3 shadow-md rounded-full">
              <HiOutlineDeviceMobile
                size={32}
                className="text-slate-600"
              ></HiOutlineDeviceMobile>
            </div>
          </a>

          {/* <a
            href={`http://maps.google.com/?q=${(petInfo as any)["owner"]["address"]} ${(petInfo as any)["owner"]["city"]} ${(petInfo as any)["owner"]["state"]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-white p-3 shadow-md rounded-full">
              <HiOutlineLocationMarker
                size={32}
                className="text-slate-600"
              ></HiOutlineLocationMarker>
            </div>
          </a> */}

          <a
            href={`https://wa.me/${(petInfo as any)["owner"]["phone_number"]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-white p-3 shadow-md rounded-full">
              <MdOutlineWhatsapp
                size={32}
                className="text-slate-600"
              ></MdOutlineWhatsapp>
            </div>
          </a>
        </div>
        <div className="container w-full sm:w-3/5 my-2 bg-white opacity-95 px-6 py-8 sm:px-12 sm:py-16 rounded-xl ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-7 text-slate-700 text-center">
            About Me
          </h2>
          <p className={`mt-3 text-sm sm:text-base leading-6 ${(petInfo as any).pet.description ? "text-gray-700" :"text-gray-300"} text-center`}>
            {(petInfo as any).pet.description ?? "No description from the owner."}
          </p>
        </div>

        <div className="container w-full sm:w-3/5 my-2 bg-white opacity-95 px-6 py-8 sm:px-12 sm:py-16 rounded-xl ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-7 text-slate-700 text-center">
            Owner Information
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-6 text-slate-700 text-center">
            Here are the details of the pet owner.
          </p>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              {/* <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Name
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-1 sm:mt-0">
                  {(petInfo as any)["owner"]["first_name"]}{" "}
                  {(petInfo as any)["owner"]["last_name"]}{" "}
                </dd>
              </div> */}
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Contact Number
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-1 sm:mt-0">
                  <a href={`tel:${(petInfo as any)["owner"]["phone_number"]}`}>
                    {(petInfo as any)["owner"]["phone_number"]}
                  </a>
                </dd>
                <dd className="mt-4 sm:mt-0 leading-6 light:text-gray-700 sm:col-span-1 flex items-start sm:justify-end">
                  <a
                    href={`tel:${(petInfo as any)["owner"]["phone_number"]}`}
                    className="text-white text-sm"
                  >
                    <div className="bg-sky-700 flex flex-row gap-1 items-center justify-center w-32 rounded-full py-1">
                      <HiOutlinePhoneOutgoing
                        size={16}
                        className="text-gray-100"
                      ></HiOutlinePhoneOutgoing>{" "}
                      <span>Call</span>
                    </div>
                  </a>
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Email address
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-1 sm:mt-0">
                  {(petInfo as any)["owner"]["email"]}
                </dd>
                <dd className="mt-4 sm:mt-0 text-base leading-6 light:text-gray-700 sm:col-span-1 flex items-start sm:justify-end">
                  <a
                    href={`mailto:${(petInfo as any)["owner"]["email"]}`}
                    className="text-white text-sm "
                  >
                    <div className="bg-sky-700 flex flex-row gap-1 items-center justify-center w-32 rounded-full py-1">
                      <HiOutlineMail
                        size={16}
                        className="text-gray-100"
                      ></HiOutlineMail>{" "}
                      <span>Email</span>
                    </div>
                  </a>
                </dd>
              </div>
              {/* <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Address
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-1 sm:mt-0">
                  {(petInfo as any)["owner"]["address"]},{" "}
                  {(petInfo as any)["owner"]["city"]},{" "}
                  {(petInfo as any)["owner"]["state"]},{" "}
                  {(petInfo as any)["owner"]["post_code"]},{" "}
                </dd>
                <dd className="mt-4 sm:mt-0 leading-6 light:text-gray-700 sm:col-span-1 flex items-start sm:justify-end">
                  <a
                    href={`http://maps.google.com/?q=${(petInfo as any)["owner"]["address"]} ${(petInfo as any)["owner"]["city"]} ${(petInfo as any)["owner"]["state"]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm"
                  >
                    <div className="bg-sky-700 flex flex-row gap-1 items-center justify-center w-32 rounded-full py-1">
                      <HiOutlineLocationMarker
                        size={16}
                        className="text-gray-100"
                      ></HiOutlineLocationMarker>{" "}
                      <span>View</span>
                    </div>
                  </a>
                </dd>
              </div> */}
              {/* <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Secondary Contact Person
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["owner"]["secondary_contact"]}{" "}
                </dd>
              </div> */}
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-semibold leading-6 light:text-gray-900">
                  Secondary Contact Number
                </dt>
                <dd className="mt-1 text-base leading-6 light:text-gray-700 sm:col-span-1 sm:mt-0">
                  <a
                    href={`tel:${(petInfo as any)["owner"]["secondary_contact_number"]}`}
                  >
                    {(petInfo as any)["owner"]["secondary_contact_number"]}
                  </a>
                </dd>
                <dd className="mt-4 sm:mt-0 leading-6 light:text-gray-700 sm:col-span-1 flex items-start sm:justify-end">
                  <a
                    href={`tel:${(petInfo as any)["owner"]["secondary_contact_number"]}`}
                    className="text-white text-sm"
                  >
                    <div className="bg-sky-700 flex flex-row gap-1 items-center justify-center w-32 rounded-full py-1">
                      <HiOutlinePhoneOutgoing
                        size={16}
                        className="text-gray-100"
                      ></HiOutlinePhoneOutgoing>{" "}
                      <span>Call</span>
                    </div>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="container w-full sm:w-3/5 my-2 bg-white opacity-95 px-6 py-8 sm:px-12 sm:py-16 rounded-xl ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-7 text-slate-700 text-center">
            Other Information
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-6 text-slate-700 text-center">
            These are my other details.
          </p>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Pet Type
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet_type"]["type"]}{" "}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Behavior
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {
                    (petInfo as any)["pet"]["behavior"] ?
                    
                    (petInfo as any)["pet"]["behavior"].split(",").map((item: string) => {
                      return (<span className='inline bg-blue-200 text-blue-700 rounded-full px-5  mr-1 py-1 text-sm'>{item}</span>
                      )
                    }) :
                      <span className='text-gray-300'> Behavior not specified.</span>
                  }
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Microchip Number
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["microchip_id"]}{" "}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Gender
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["gender"]}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Desexed
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["gender"].split(" ").length > 1 ? "Yes" : "No"}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Breed
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["breed"]}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Weight
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["weight"]} {(petInfo as any)["pet"]["weight"] > 1 ? "lbs" : "lb"} 
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 light:text-gray-900">
                  Color
                </dt>
                <dd className="mt-1 text-sm leading-6 light:text-gray-700 sm:col-span-2 sm:mt-0">
                  {(petInfo as any)["pet"]["color"]}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <a
          href="/"
          className="block bg-sky-600 text-white px-10 py-2 mb-10 rounded-sm"
        >
          Visit Website
        </a>
      </div>
      </div>
    </>
  )
}

export default PetPublicDetailsPage
