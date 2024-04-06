import moment from "moment";
import { GiMedicines } from "react-icons/gi";
import { BiEditAlt, BiSolidInjection, BiSolidVirus } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { PageInfoContext } from "../../../../../../flux/navigation/store";
import { PetInfo } from "../../../../../../flux/pets/types";
import { changePage } from "../../../../../../flux/navigation/action";
import { UserInfo } from "../../../../../../flux/user/types";
import { axiosPrivate } from "../../../../../../api/axios";
import PetDetailsComponent from "../../../Shared/Components/petDetails";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPetDetailsPage = () => {
  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const pd = pageState.pageData;

  const [petInfo, setPetInfo] = useState<PetInfo>(pd);
  const [owner, setOwner] = useState<UserInfo | null>(null);

  

  const getOwnerDetails = async () => {
    await axiosPrivate
      .get(`/pet/owner/${petInfo.owner_id}/details`)
      .then((response) => {
        setOwner(response.data)
      })
      .catch((error) => {
        pageDispatch(changePage("admin_users"))
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getOwnerDetails();
    };

    fetchData();
  }, []);


  return (
    <>
      <div className="relative ml-0 md:ml-60 bg-yello-200 py-4 px-4 md:px-10 z-10">
        <div className="flex justify-start items-center">
          <h1
            onClick={() => pageDispatch(changePage("admin_users_details", owner as UserInfo),)}
            className="flex justify-center items-center py-2 text-sm md:text-base cursor-pointer"
          >
            <FiChevronLeft size={14} className="" /> Back
          </h1>
        </div>
        {/* Insert Pet Details Component Here */}
        {owner !== null && owner !== undefined ? <PetDetailsComponent title={`${owner.firstname}'s Pet Details`} petInfo={petInfo} ownerInfo={owner as UserInfo} viewOnly={true}/> : <></>}
      </div>
    </>
  );
};

export default AdminPetDetailsPage;
