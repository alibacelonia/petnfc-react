import React, { useEffect } from 'react'
import {
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLogic } from './logic';
import { PageInfoContext } from '../../../../../flux/navigation/store';
import { PetInfo } from '../../../../../flux/pets/types';
import { axiosPrivate } from '../../../../../api/axios';
import { UserInfo } from '../../../../../flux/user/types';
import PetCardList from './PetList';
import UserDetailsComponent from '../../Shared/Components/userDetails';
import { changePage } from '../../../../../flux/navigation/action';
import { FiChevronLeft } from 'react-icons/fi';

const noPets = () => {
    return (
      <>
        <div className="mt-4 bg-red-1000 relative h-96 min-w-full flex items-center justify-center">
          <h1>No registered pets yet.</h1>
        </div>
      </>
    );
  };


const AdminUserDetailsPage = () => {

  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const userInfo: UserInfo = pageState.pageData
  const [pets, setPets] = React.useState<PetInfo[]>([]);

  const {} = useLogic();


  const getOwnerPets = () => {
    axiosPrivate.get(`/pet/${userInfo.id}/list`).then((response) => {
        console.log("owner pets: ",response.data.pets);
        setPets(response.data.pets)
    }).catch((error) => {

    });
  }

    useEffect(() => {
        getOwnerPets()
    }, []);

  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex justify-start items-center">
          <h1
            onClick={() => pageDispatch(changePage("admin_users"))}
            className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"
          >
            <FiChevronLeft size={14} className="" /> Back
          </h1>
        </div>

        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700">
            User Details
          </h1>
        </div>
        {/* Insert User Component Here */}
        <UserDetailsComponent userInfo={userInfo} />

        <div className="flex items-end min-w-full justify-between h-12">
          <h1 className="pl-2 md:pl-0 text-xl md:text-2xl tracking-normal font-bold text-gray-700 capitalize">
            {`${userInfo.firstname}'s ${pets.length > 1 ? 'Pets' : 'Pet'}`}
          </h1>
        </div>
        {pets.length > 0 ? <PetCardList data={pets} /> : noPets()}
      </div>
    </>
  )
}

export default AdminUserDetailsPage
