"use client"; // this is a client component
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineIdentification,
  HiOutlineQrcode,
  HiOutlinePencilAlt,
  HiOutlineUserGroup,
  HiOutlineSearchCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi";

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

const WhyBuyOurProductSection = () => {
    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

  return (
    <section
      ref={ref1}
      id="whybuyourproduct"
      className={`transition-opacity ease-in duration-1000 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      } overflow-hidden pt-5`}
    >
      <div className="flex flex-col animate-fadeIn animation-delay-2 pt-6 sm:pt-20 md:flex-row md:text-left">
        <div className="w-full">
          <h1 className="text-2xl font-semibold mt-6 md:mt-6 md:text-4xl text-center sm:text-left text-slate-700">
            Why Buy Our Product?
          </h1>
          <div className="flex flex-row sm:flex-col flex-wrap gap-4 sm:gap-12 mt-8 sm:mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-evenly">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineQrcode
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineQrcode>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Effortless Pet Safety
                  </h1>
                  <p className="text-slate-700">
                    Our intuitive Pet QR Codes streamline the process of
                    locating your pet in case they go missing.
                  </p>
                </div>
              </div>
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineIdentification
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineIdentification>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Rapid Identification:
                  </h1>
                  <p className="text-slate-700 ">
                    In the event of a lost pet, our QR code system ensures swift
                    and accurate identification.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineSearchCircle
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineSearchCircle>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Heightened Recovery Probability
                  </h1>
                  <p className="text-slate-700 ">
                    A quick scan grants anyone who finds your pet access to your
                    contact information, significantly improving the chances of
                    a prompt reunion.
                  </p>
                </div>
              </div>
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlinePencilAlt
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlinePencilAlt>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Comprehensive Care Data
                  </h1>
                  <p className="text-slate-700 ">
                    Store crucial information like medical history,
                    vaccinations, and dietary needs within the QR code,
                    facilitating superior care, especially in emergencies.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineUserGroup
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineUserGroup>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    User-Friendly Operation
                  </h1>
                  <p className="text-slate-700 ">
                    Scanning the QR code is a straightforward task, requiring
                    only a smartphone or a QR code reader.
                  </p>
                </div>
              </div>
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineShieldCheck
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineShieldCheck>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Cost-Effective Security
                  </h1>
                  <p className="text-slate-700 ">
                    Our Pet QR Codes deliver top-notch safety at a reasonable
                    cost, offering a smart and affordable solution for your
                    pet's well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuyOurProductSection;
