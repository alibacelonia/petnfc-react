"use client"; // this is a client component
import { Fragment, useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { Link } from "react-scroll/modules";

import { Dialog, Transition } from "@headlessui/react";

export function useIsVisible(ref:any) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

const HeroSection = () => {
    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);
    
    const ref2 = useRef<HTMLDivElement>(null);
    const isVisible2 = useIsVisible(ref2);
    

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <section id="home" className="overflow-hidden pt-5">
      <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 pt-14 sm:pt-32 md:flex-row md:text-left">
        <div
          ref={ref1}
          className={`transition-opacity ease-in duration-1000 ${
            isVisible1 ? "opacity-100" : "opacity-0"
          } w-full md:w-1/2 pr-6`}
        >
          <h1
            className={`text-2xl font-semibold mt-6 md:mt-0 md:text-5xl text-slate-700`}
          >
            Find Your Lost Companion with Ease!
          </h1>
          <p className="text-lg mt-10 mb-6 sm:mb-16 md:text-lg text-slate-700">
            Discover the effortless way to reunite with your beloved furry
            friend. Our innovative solution makes finding your lost pet a
            breeze, bringing peace of mind to pet owners everywhere. Say goodbye
            to worry and hello to a quicker, easier reunion.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-left justify-center sm:justify-start gap-2">
            <button
              onClick={openModal}
              className="transition ease-in-out w-full sm:w-auto flex items-center justify-center rounded-md bg-slate-700 px-3.5 py-2.5 hover:bg-slate-900 focus-visibility:outline 
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-500"
            >
              <img src="appstore-light.svg" alt="appstore" width={120} />
            </button>
            <button
              onClick={openModal}
              className="transition ease-in-out w-full sm:w-auto flex items-center justify-center rounded-md bg-slate-700 px-3.5 py-2.5 hover:bg-slate-900 focus-visibility:outline 
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-500"
            >
              <img src="googleplay-light.svg" alt="appstore" width={130} />
            </button>
          </div>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        The app is currently in development.
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Please check back soon for updates!
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Got it, thanks!
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
          <div className="flex flex-col sm:flex-row items-center sm:items-left justify-center sm:justify-start  gap-1 mb-10 mt-12 sm:mt-48 ">
            <Link
              to="features"
              className="flex items-center sm:items-left justify-center sm:justify-start gap-2"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
            >
              <span className="rounded-full bg-slate-100 p-3">
                <HiChevronDown color="black"></HiChevronDown>
              </span>
              <span className="text-slate-700">Discover More</span>
            </Link>
          </div>
        </div>
        <div
          ref={ref2}
          className={`transition-opacity ease-in duration-1000 ${
            isVisible2 ? "opacity-100" : "opacity-0"
          } w-full md:w-1/2 `}
        >
          <div className="relative overflow-hidden pt-4 mx-auto me-md-0 max-w-xl min-h-screen">
            <div className="flex flex-col sm:flex-row items-center sm:items-left justify-center sm:justify-start">
              <img
                src="/assets/hero-phone-2.png"
                className="rellax absolute top-0 start-10"
                data-rellax-speed="2.8"
                data-disable-parallax-down="md"
                alt="Phone"
              />
              <img
                src="/assets/hero-phone-1.png"
                alt=""
                className="rellax absolute top-12 start-0 z-index-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
