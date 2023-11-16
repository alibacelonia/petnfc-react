"use client"; // this is a client component
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineIdentification,
  HiOutlineQrcode,
  HiOutlinePencilAlt,
  HiOutlineInformationCircle,
  HiOutlineUserGroup,
  HiOutlineSearchCircle,
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

const FeaturesSection = () => {
    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);
    
    const ref2 = useRef<HTMLDivElement>(null);
    const isVisible2 = useIsVisible(ref2);

  return (
    <section id="features" className="overflow-hidden pt-5">
      <div className="flex flex-col animate-fadeIn animation-delay-2 pt-6 sm:pt-20 md:flex-row md:text-left">
        <div
          ref={ref2}
          className={`transition-opacity ease-in duration-1000 ${
            isVisible2 ? "opacity-100" : "opacity-0"
          } hidden lg:block lg:w-5/12 `}
        >
          <div className="relative overflow-hidden pt-4 mx-auto me-md-0 max-w-xl min-h-screen">
            <div className="flex flex-col sm:flex-row items-center sm:items-left justify-center sm:justify-start">
              <img src="/assets/phone.png" className="max-w-sm" alt="Phone" />
            </div>
          </div>
        </div>
        <div
          ref={ref1}
          className={`transition-opacity ease-in duration-1000 ${
            isVisible1 ? "opacity-100" : "opacity-0"
          } w-full lg:w-7/12`}
        >
          <h1 className="text-2xl font-semibold mt-6 md:mt-6 md:text-4xl text-center sm:text-left text-slate-700">
            App Features
          </h1>
          <p className="text-lg mt-6 mb-16 md:text-lg text-center sm:text-left text-slate-700">
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Suspendisse consequat fringilla dolor, vel ornare est feugiat aliquam. */}
          </p>
          <div className="flex flex-row sm:flex-col flex-wrap gap-4 sm:gap-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineIdentification
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineIdentification>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Quick Identification
                  </h1>
                  <p className="text-slate-600">
                    Our cutting-edge system streamlines the process of
                    pinpointing your lost pet's whereabouts.
                  </p>
                </div>
              </div>
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineSearchCircle
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineSearchCircle>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Accessible Medical Information
                  </h1>
                  <p className="text-slate-600">
                    Empowering you with instant access to your pet’s crucial
                    medical data. Our platform ensures your pet’s health
                    information is readily available whenever and wherever you
                    need it.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineQrcode
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineQrcode>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    QR and NFC Tagging
                  </h1>
                  <p className="text-slate-600">
                    With a simple scan or tap, unlock a world of information,
                    convenience, and possibilities for your pet’s data and
                    location.
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
                    Customizable Information
                  </h1>
                  <p className="text-slate-600">
                    Tailor you and your pet’s digital information based on your
                    preferences. Our platform empowers you to personalize
                    information, ensuring it suits your unique needs and tastes.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineInformationCircle
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineInformationCircle>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Easy Information Updates
                  </h1>
                  <p className="text-slate-600">
                    Our platform simplifies the process of keeping your
                    information up-to-date. With user-friendly tools and
                    seamless integration, you can ensure that your information
                    is always accurate and relevant.
                  </p>
                </div>
              </div>
              <div className="flex items-start w-full sm:w-1/2">
                <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-3">
                  <HiOutlineUserGroup
                    size={35}
                    className="text-neutral-100"
                  ></HiOutlineUserGroup>
                </div>
                <div className="pl-4">
                  <h1 className="font-semibold text-lg pb-1 mb-1 text-slate-700">
                    Community Building
                  </h1>
                  <p className="text-slate-600">
                    Forge meaningful connections and foster unity within your
                    community. Our platform provides the tools and resources you
                    need to bring people together, whether it's for a common
                    cause, shared interests, or local engagement.
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

export default FeaturesSection;
