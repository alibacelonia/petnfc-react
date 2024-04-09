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
import CryptoJS from "crypto-js";
import useWebSocket, { ReadyState } from "react-use-websocket";

function decryptData(base64Key: any, encryptedData: any) {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const dataBytes = CryptoJS.enc.Base64.parse(encryptedData);
  const iv = CryptoJS.lib.WordArray.create(dataBytes.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(
    dataBytes.words.slice(4)
  );
  const decryptedBytes = CryptoJS.AES.decrypt({ ciphertext } as CryptoJS.lib.CipherParams, key, { iv });
  const decryptedText = CryptoJS.enc.Utf8.stringify(decryptedBytes);
  return decryptedText;
};


interface Notification {
  id: string;
  message: string;
  created_at: string; 
  is_read: boolean; 
}
export const useLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pageState, pageDispatch } = React.useContext(PageInfoContext);
  const { petState, petDispatch } = React.useContext(PetInfoContext);
  const { userState, userDispatch } = React.useContext(UserInfoContext);
  const [currentPage, setPage] = useState("home");
  const [user, setUser] = useState<UserInfo | null>(userState.userInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const toast = useToast();
  const petStateHistory = petState.history;
  const userStateHistory = userState.history;

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
    if(userStateHistory.length > 0) {
      const type = userStateHistory[userStateHistory.length - 1].type;
      if (type == "UPDATE_PET") {
        const state1 = userStateHistory[userStateHistory.length - 1].payload?.targetUserInfo?.email
        const state2 = userStateHistory[userStateHistory.length - 2].payload?.targetUserInfo?.email
        if(state1 != state2){
          // toast({
          //   position: "top",
          //   title: "Email Updated Successfully",
          //   description: "Your account now reflects the updated email address.",
          //   status: "success",
          //   isClosable: true,
          //   duration: 3000,
          // });
        }
        else{
          toast({
            position: "top",
            title: "User Profile Updated",
            description: "Your profile has been successfully updated.",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
        }
      }
    }
  }, [userState]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axiosPrivate.get("/user/details", { signal }),
          axiosPrivate.get("/pet/mypets", { signal }),
        ]);

        const decryptedText = decryptData(response1?.data.key,  response1?.data.data);
        const userObj = JSON.parse(decryptedText)
        // console.log("userdata: ",userObj)

        userDispatch(fetchUserData(userObj));
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
                  no_of_scans: 0,
                  behavior: "",
                  description: "",
                  created_at: "",
                  updated_at: "",

                  allergies: "",
                  medications: "",
                  vaccines: "",
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
            description: "Error fetching data",
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
      // abortController.abort();
    };
  }, []);

  return { currentPage };
};
