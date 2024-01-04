"use client";

import { useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { HiOutlineShoppingCart, HiUser } from "react-icons/hi";
import { Link as SmoothScrollLink } from "react-scroll/modules";
import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  page: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Features",
    page: "features",
  },
  {
    label: "How Does It Work",
    page: "howitworks",
  },
  {
    label: "Why Buy Our Product",
    page: "whybuyourproduct",
  },
  {
    label: "FAQ's",
    page: "faqs",
  },
  {
    label: "Blogs",
    page: "blogs",
  },
  {
    label: "My Account",
    page: "account",
  },
];

export default function Navbar2() {
  const [navbar, setNavbar] = useState(false);
  return (
    <header className="w-full mx-auto  px-4 sm:px-20 fixed top-0 z-50 shadow bg-white">
      <div className="justify-between md:items-center md:flex">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link
              to="/"
            >
              <div className="container flex items-center space-x-2">
                <Image
                  className="hidden sm:block"
                  src="/logo/2.png" // Route of the image file
                  width={45} // Desired size with correct aspect ratio
                  alt="logo"
                />
                <h1 className="text-xl font-bold hidden sm:block text-slate-700">
                  PetNFC
                </h1>
              </div>
            </Link>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <div className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {NAV_ITEMS.map((item, idx) => {
                let classnames =
                  "block lg:inline-block text-sm md:text-sm cursor-pointer";
                let linkText = undefined;
                switch (item.page) {
                  case "order":
                    linkText = (
                      <div className="flex gap-1 " key={item.page}>
                        <HiOutlineShoppingCart size={20} /> {item.label}
                      </div>
                    );
                    classnames +=
                      " transition ease-in-out bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md duration-500";
                    break;
                  case "account":
                    linkText = (
                      <div
                        className="flex gap-1 lg:border-l-2 lg:pl-4"
                        key={item.page}
                      >
                        <HiUser size={18} /> {item.label}
                      </div>
                    );
                    classnames += " ";
                    break;

                  default:
                    linkText = item.label;
                    classnames +=
                      " text-neutral-900  hover:text-neutral-500";
                }

                if (item.page === "account"){
                  return (
                    <Link to={"/signin"} className={classnames} key={idx}>
                      {linkText}
                    </Link>
                  );
                }
                else{
                    return (
                        <Link to={`/#${item.page}`} className={classnames} key={idx}>
                          {linkText}
                        </Link>
                      );
                //   return (
                //     <SmoothScrollLink
                //       key={idx}
                //       to={item.page}
                //       className={classnames}
                //       activeClass="active"
                //       spy={true}
                //       smooth={true}
                //       offset={-100}
                //       duration={500}
                //       onClick={() => setNavbar(!navbar)}
                //     >
                //       {linkText}
                //     </SmoothScrollLink>
                //   )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
