import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageInfoContext } from "../../../flux/navigation/store";
import { PetInfoContext } from "../../../flux/pets/store";
import { UserInfoContext } from "../../../flux/user/store";
import { axiosPrivate } from "../../../api/axios";
import { fetchUserData } from "../../../flux/user/action";
import { fetchPetData } from "../../../flux/pets/action";
import { changePage } from "../../../flux/navigation/action";
import { PetInfo } from "../../../flux/pets/types";
import { AxiosError } from "axios";
import { useToast } from "@chakra-ui/react";
import { UserInfo } from "../../../flux/user/types";

export const useLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const { petState, petDispatch } = React.useContext(PetInfoContext);
  const { userState, userDispatch } = React.useContext(UserInfoContext);
  const [currentPage, setPage] = useState("home");
  const [user, setUser] = useState<UserInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const toast = useToast();
  const petStateHistory = petState.history;

  useEffect(() => {
    // Batching localStorage calls
    if (pageState.selectedPage !== undefined) {
      const { selectedPage, pageData } = pageState;

      // Set the current page and page data in localStorage
      localStorage.setItem("currentPage", selectedPage);
      localStorage.setItem("pageData", JSON.stringify(pageData));

      // Update the page state
      setPage(selectedPage);
    }
    setReady(true);
  }, [pageState]);

  useEffect(() => {
    if (isLoading && !ready) {
      return;
    }
    const type = petStateHistory[petStateHistory.length - 1].type;
    if (type == "UPDATE_PET") {
      toast({
        position: "top",
        title: "Pet Details Updated",
        description: "Pet information has been successfully updated.",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    }
    if (type == "ADD_PET") {
      toast({
        position: "top",
        title: "New Pet Information Added",
        description: "Your pet's details have been successfully updated.",
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    }
  }, [petState]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axiosPrivate.get("/user/details", { signal }),
          axiosPrivate.get("/pet/mypets", { signal }),
        ]);
        userDispatch(fetchUserData(response1?.data));
        petDispatch(fetchPetData(response2?.data?.pets));

        const linkedText = localStorage.getItem("linkedID");
        const linkedID = linkedText?.replace("https://secure-petz.info/", "");
        if (linkedID) {
        
          axiosPrivate
            .get(`/pet/${linkedID}/get_details`)
            .then((response) => {
              const data = response.data;
              if (data.owner_id) {
                toast({
                  position: "top",
                  title: "QR Code Already Used",
                  description:
                    "The provided QR Code has already been taken. Please get a new one.",
                  status: "error",
                  isClosable: true,
                  duration: 4000,
                });
                localStorage.removeItem("linkedID");
              } else {
                const data: PetInfo = {
                  id: 0,
                  owner_id: response1?.data.id || "",
                  name: "",
                  breed: "",
                  pet_type_id: 0,
                  microchip_id: "",
                  unique_id: linkedID || "",
                  main_picture: "",
                  color: "",
                  gender: "",
                  date_of_birth_year: 0,
                  date_of_birth_month: 0,
                  weight: 0,
                  behavior: "",
                  description: "",
                  created_at: "",
                  updated_at: "",
                };
                pageDispatch(changePage("home_register_pet", data))
              }
            })
            .catch((error) => {
              console.error(error.response.status);
              if (error.response.status === 404) {
                toast({
                  position: "top",
                  title: "QR Code Not Recognized",
                  description:
                    "The provided QR Code could not be found. Please try again.",
                  status: "error",
                  isClosable: true,
                  duration: 4000,
                });
              }
            })
            .finally(() => {});
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.name === "CanceledError") {
          // console.log('Request aborted');
        } else {
          toast({
            position: "top",
            title: "Error Fetching Data",
            // description: "Error fetching data",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      // cancel the request before component unmounts
      abortController.abort();
    };
  }, []);

  return { currentPage };
};
