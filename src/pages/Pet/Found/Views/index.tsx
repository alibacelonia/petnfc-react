import { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import { Controller } from "react-hook-form";
import { axiosPrivate } from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons";
import {
    Divider,
    Text
 } from "@chakra-ui/react"


const PetFoundPage = () => {


    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();
  

  const PageFour = () => {
    return (
      <>
      <div className="relative bg-white rounded-2xl p-6 overflow-hidden">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-sky-700">Record Added!</h1>
              <p className="text-base text-gray-700 text-center mt-3">Thank you for registering your and your pet's information. </p>
              <p className="text-base text-gray-700  text-center mt-2"> Your details have been successfully recorded.</p>
            </div>
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
            onClick={()=>{
              navigate('/signin', {replace: true});
            }}
              type="button"
              className="text-xs lg:text-sm text-white bg-blue-500 px-8 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-out"
            >
              Proceed to Login
            </button>
          </div>
      </div>
      </>
    )
  }

  useEffect(() => {
  }, []);

  
  return (
    <>
      <div className="bg-fixed bg-pet-bg bg-repeat bg-top-left bg-16">
        <div className="relative ml-0 backdrop-blur-md bg-white/30 py-4 px-4 md:px-10 z-10">
          <div className="flex flex-row justify-center items-start min-h-screen bg-red-00">
            <div className="relative min-h-fit bg-white px-4 md:px-8 py-6 md:py-16 shadow-md w-full md:w-5/6 lg:w-4/6">
                <div className="flex flex-col justify-start items-center">
                    <SearchIcon boxSize={'50px'} color={'blue.500'} />
                    <Text color={'blue.500'} fontSize="xx-large" fontWeight="600" mt={4}>Record Found!</Text>
                    <p className="text-center text-gray-500 text-lg mt-3">The scanned QR code does not have any associated records. <br/>Would you like to provide the missing information?</p>
                </div>
                <div className="flex flex-col justify-start items-center mt-4 gap-2 ">
                    <button  onClick={()=>{ navigate(`/pet/${id}/create`, { replace: true })}} className="bg-blue-400 text-white px-6 py-2 cursor-pointer hover:bg-blue-500">
                        Yes
                    </button> 
                    <a href="/" className="bg-gray-100 text-slate-700 px-6 py-2 cursor-pointer hover:bg-gray-200">
                        No, back to website
                    </a>
                    <Divider width="50%" my={4}></Divider>
                    <span className="mb-4 text-gray-500 ">Already have an account?</span>
                    <button onClick={()=>{ localStorage.setItem("linkedID", `https://secure-petz.info/${id}`); navigate('/signin', { replace: true }) }} className="bg-blue-400 text-white px-6 py-2 cursor-pointer hover:bg-blue-500">
                        Link Account
                    </button> 
                </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default PetFoundPage;
