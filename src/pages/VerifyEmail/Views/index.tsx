import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsSuccess } from "./loading";

const VerifyEmailResultPage = () => {
const outletContext = useIsSuccess();
const isSuccess = outletContext?.isSuccess as boolean; 

  return (
    <div className="flex flex-col items-center justify-center py-12 bg-[#f4f7ff] min-h-screen">
      <main>
        <div className="m-0 px-20 py-16 bg-gray-50 rounded-md text-center">
          <div className="flex flex-row items-center justify-center w-full mb-10">
            <img src="https://petnfc.com.au/logo/3.png" className="w-16" />
            <h1 className="text-[#0169BB] font-bold text-3xl">PetNFC</h1>
          </div>

          <h1 className={`${isSuccess ? 'text-[#0169BB]' : 'text-[#e11d48]'} text-3xl font-bold uppercase`}>
            {isSuccess ? "Account verified successfully" : "Account Already Verified"}
          </h1>
          <p className={`${isSuccess ? 'text-[#45aeff]' : 'text-[#fb7185]'} mt-2 text-gray-400`}>
            {isSuccess ? "Thank you for verifying your account." : "Email can only be verified once."}
          </p>
          <div className="flex flex-col gap-3 mt-12">
            <a href="/" className="text-[#3b82f6] text-sm">
              Back to Website
            </a>
            <a href="/signin" className="text-[#3b82f6] text-sm">
              Proceed to Login
            </a>
          </div>
        </div>

        <p className=" my-0 mx-auto mt-10 text-center text-sm font-medium text-[#8c8c8c]">
          Need help? Ask at &nbsp;
          <a href="mailto:archisketch@gmail.com" className="text-[#0169BB]">
            support@petnfc.com.au
          </a>
        </p>
      </main>

      <footer className="w-full max-w-lg my-8 text-center border-t-2 border-solid border-gray-100 ">
        <p className="mt-8 text-[16px] font-bold text-gray-700">
          {" "}
          PetNFC Company{" "}
        </p>
        <p className=" text-gray-700  text-sm">
          26 Avondale Street, Springvale, Victoria.
        </p>
        <div className="my-4 flex flex-row gap-2 items-center justify-center">
          <a href="https://www.facebook.com/petnfc.au" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0,0,256,256"
              className="fill-black"
            >
              <defs>
                <linearGradient
                  x1="34.083"
                  y1="4.872"
                  x2="29.773"
                  y2="57.75"
                  gradientUnits="userSpaceOnUse"
                  id="color-1_123741_gr1"
                >
                  <stop offset="0" stopColor="#3b82f6"></stop>
                  <stop offset="1" stopColor="#93c5fd"></stop>
                </linearGradient>
                <linearGradient
                  x1="32.247"
                  y1="10.462"
                  x2="32.247"
                  y2="54.005"
                  gradientUnits="userSpaceOnUse"
                  id="color-2_123741_gr2"
                >
                  <stop offset="0" stopColor="#3b82f6"></stop>
                  <stop offset="1" stopColor="#93c5fd"></stop>
                </linearGradient>
              </defs>
              <g transform="translate(35.84,35.84) scale(0.72,0.72)">
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="#339af0"
                  strokeWidth="8"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  className="mix-blend-mode: normal"
                >
                  <path
                    d="M128,300.53697c-95.28954,0 -172.53697,-77.24743 -172.53697,-172.53697v0c0,-95.28954 77.24743,-172.53697 172.53697,-172.53697v0c95.28954,0 172.53697,77.24743 172.53697,172.53697v0c0,95.28954 -77.24743,172.53697 -172.53697,172.53697z"
                    id="shape"
                  ></path>
                </g>
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  className="mix-blend-mode: normal"
                >
                  <g transform="translate(-5.44322,0) scale(4,4)">
                    <path
                      d="M37,58h-9c-0.552,0 -1,-0.448 -1,-1v-22h-7c-1.105,0 -2,-0.895 -2,-2v-7c0,-1.105 0.895,-2 2,-2h7v-5.494c0,-7.831 4.397,-12.506 11.763,-12.506c2.737,0 4.511,0.172 5.685,0.286v0c0.879,0.079 1.552,0.816 1.552,1.699v7.31c0,0.941 -0.763,1.705 -1.705,1.705l-3.684,0.002c-1.121,0 -1.859,0.17 -2.195,0.505c-0.422,0.422 -0.42,1.38 -0.417,2.594l0.001,3.899h6.721c1.196,0 2.125,1.044 1.987,2.232l-0.934,7c-0.118,1.008 -0.972,1.768 -1.987,1.768h-5.787v22c0,0.552 -0.448,1 -1,1zM29,56h7v-23h7.808l0.934,-7h-8.7l-0.042,-5.885c-0.004,-1.547 -0.008,-3.008 1.002,-4.02c0.744,-0.747 1.892,-1.095 3.611,-1.095l3.387,0.042v-6.812c-1.18,-0.114 -2.777,-0.252 -5.237,-0.252c-6.296,0 -9.763,3.731 -9.763,10.506v7.516h-9v7h9z"
                      fill="url(#color-1_123741_gr1)"
                    ></path>
                    <g fill="url(#color-2_123741_gr2)">
                      <path d="M31,54v-23h-9v-3h9v-9.494c0,-5.644 2.612,-8.506 7.763,-8.506c1.307,0 2.362,0.041 3.237,0.096v2.034h-1.398c-1.434,0 -3.517,0.174 -5.019,1.68c-1.593,1.598 -1.588,3.722 -1.583,5.43v8.76h8.495l-0.467,3h-8.028v23z"></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </a>
          <a href="https://www.instagram.com/petnfc.info/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0,0,256,256"
              className="fill-black"
            >
              <defs>
                <linearGradient
                  x1="32"
                  y1="6.667"
                  x2="32"
                  y2="57.872"
                  gradientUnits="userSpaceOnUse"
                  id="color-1_43625_gr1"
                >
                  <stop offset="0" stopColor="#3b82f6"></stop>
                  <stop offset="1" stopColor="#93c5fd"></stop>
                </linearGradient>
                <linearGradient
                  x1="32"
                  y1="18.167"
                  x2="32"
                  y2="45.679"
                  gradientUnits="userSpaceOnUse"
                  id="color-2_43625_gr2"
                >
                  <stop offset="0" stopColor="#3b82f6"></stop>
                  <stop offset="1" stopColor="#93c5fd"></stop>
                </linearGradient>
                <linearGradient
                  x1="46"
                  y1="12.75"
                  x2="46"
                  y2="23.049"
                  gradientUnits="userSpaceOnUse"
                  id="color-3_43625_gr3"
                >
                  <stop offset="0" stopColor="#3b82f6"></stop>
                  <stop offset="1" stopColor="#93c5fd"></stop>
                </linearGradient>
              </defs>
              <g transform="translate(35.84,35.84) scale(0.72,0.72)">
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="#339af0"
                  strokeWidth="8"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  className="mix-blend-mode: normal"
                >
                  <path
                    d="M128,300.53697c-95.28954,0 -172.53697,-77.24743 -172.53697,-172.53697v0c0,-95.28954 77.24743,-172.53697 172.53697,-172.53697v0c95.28954,0 172.53697,77.24743 172.53697,172.53697v0c0,95.28954 -77.24743,172.53697 -172.53697,172.53697z"
                    id="shape"
                  ></path>
                </g>
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  className="mix-blend-mode: normal"
                >
                  <g transform="scale(4,4)">
                    <path
                      d="M44,57h-24c-7.168,0 -13,-5.832 -13,-13v-24c0,-7.168 5.832,-13 13,-13h24c7.168,0 13,5.832 13,13v24c0,7.168 -5.832,13 -13,13zM20,9c-6.065,0 -11,4.935 -11,11v24c0,6.065 4.935,11 11,11h24c6.065,0 11,-4.935 11,-11v-24c0,-6.065 -4.935,-11 -11,-11z"
                      fill="url(#color-1_43625_gr1)"
                    ></path>
                    <path
                      d="M32,45c-7.168,0 -13,-5.832 -13,-13c0,-7.168 5.832,-13 13,-13c7.168,0 13,5.832 13,13c0,7.168 -5.832,13 -13,13zM32,23c-4.962,0 -9,4.038 -9,9c0,4.963 4.038,9 9,9c4.963,0 9,-4.037 9,-9c0,-4.962 -4.037,-9 -9,-9z"
                      fill="url(#color-2_43625_gr2)"
                    ></path>
                    <path
                      d="M46,15c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3z"
                      fill="url(#color-3_43625_gr3)"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </div>
        <p className="mt-2 text-gray-700 text-sm">
          Copyright © 2023 PetNFC. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default VerifyEmailResultPage;
