import { Avatar, useBreakpointValue, useAvatarStyles, AvatarProps, Divider } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { BiEditAlt } from 'react-icons/bi';
import { HiOutlinePencil } from "react-icons/hi2";
import { UserInfoContext } from '../../../../flux/user/store';
import { UserInfo } from '../../../../flux/user/types';
import { changePage } from '../../../../flux/navigation/action';
import { PageInfoContext } from '../../../../flux/navigation/store';
const ProfilePage = () => {

  const {userState} = React.useContext(UserInfoContext)
  const {pageDispatch} = React.useContext(PageInfoContext)
  const userInfo: UserInfo = userState?.userInfo


  const avatarSize = useBreakpointValue({ base: "xl", lg: "2xl" });
  useEffect(() => {
    console.log("userChanges")
  }, [userState]);
  return (
    <>
    <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            Profile
          </h1>
        </div>
        <div className="relative bg-white rounded-2xl mt-5 px-10 py-10 lg:px-20 lg:py-12 mb-8">
          <div className='flex flex-col lg:flex-row items-center lg:items-start justify-center  gap-2'>
            
            <div className='ring-offset-2 ring-4 ring-gray-300 rounded-full bg-red-200'>
              <Avatar
                size={avatarSize}
                name={`${userInfo.firstname} ${userInfo.lastname}`}
                src={""}
                bg="blue.500"
              />
            </div>

            <div className='flex flex-col gap-2 bg-blue-2000 grow items-center lg:items-start pt-4 lg:pl-4'>
              <h1 className='text-2xl lg:text-3xl font-semibold text-gray-700 capitalize grow truncate'>{userInfo.firstname} {userInfo.lastname}</h1>
              <h1 className='lowercase text-gray-700'>{userInfo.email}</h1>
              <h1 className='capitalize text-gray-700'>{userInfo.role == "user" ? "Pet Owner" : "Pet Walker"}</h1>
            </div>
            <div className='bg-yellow-2000'>
              <button
                onClick={() => pageDispatch(changePage("profile_edit", userInfo))}
                className="text-xs md:text-sm  text-white bg-gradient-to-r from-blue-400 to-blue-500 px-3 py-1 md:px-3 md:py-2 rounded-full shadow-md  "
              >
                <BiEditAlt size={18} className="inline" /> Edit Profile
              </button>
            </div>
          </div>
          <Divider className='mt-8 mb-6'></Divider>
          <div className='grid grid-cols-12 bg-red-1000'>
            <div className="col-span-12 lg:col-span-4 font-semibold text-gray-700">Address</div>
            <div className="col-span-12 lg:col-span-8">
              <p className='text-left lg:text-right text-clip text-gray-700 capitalize'>
                {userInfo.street_address}, &nbsp;
                {userInfo.city} , &nbsp;
                {userInfo.state} , &nbsp;
                {/* {userInfo.country} , &nbsp; */}
                {userInfo.postal_code} 
              </p>
            </div>

            <div className='col-span-12 mt-6'><Divider></Divider></div>

            <div className="col-span-12 lg:col-span-4 font-semibold text-gray-700 mt-6">Phone Number</div>
            <div className="col-span-12 lg:col-span-8 lg:mt-6"><p className='text-left lg:text-right text-clip text-gray-700'>{userInfo.phone_number}</p></div>

            <div className='col-span-12 mt-6'><Divider></Divider></div>

            <div className="col-span-12 lg:col-span-4 font-semibold text-gray-700 mt-6">Secondary Contact Person</div>
            <div className="col-span-12 lg:col-span-8 lg:mt-6"><p className='text-left lg:text-right text-clip text-gray-700'>{userInfo.secondary_contact}</p></div>

            <div className='col-span-12 mt-6'><Divider></Divider></div>

            <div className="col-span-12 lg:col-span-4 font-semibold text-gray-700 mt-6">Secondary Contact Number</div>
            <div className="col-span-12 lg:col-span-8 lg:mt-6"><p className='text-left lg:text-right text-clip text-gray-700'>{userInfo.secondary_contact_number}</p></div>
{/* 
            <div className='col-span-12 mt-6'><Divider></Divider></div>

            <div className="col-span-12 lg:col-span-4 font-semibold text-gray-700 mt-6">Address</div>
            <div className="col-span-12 lg:col-span-8 lg:mt-6"><p className='text-left lg:text-right text-clip text-gray-700'>{userInfo.secondary_contact_number}</p></div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
