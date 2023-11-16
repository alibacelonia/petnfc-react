"use client"; // this is a client component
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

export function useIsVisible(ref: any) {
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

const HowItWorksSection = () => {
  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const steps = [
    {
      step: 1,
      title: "Navigate to Sign Up Section",
      description:
        "Let's assume that you're not registered yet. Let's navigate to the Sign Up Section and Register.",
    },
    {
      step: 2,
      title: "Select Sign Up Option",
      description:
        "You can select to Sign Up via QR Code or Via NFC Tag. Select what is currently available to your device.",
    },
    {
      step: 2.1,
      title: "NFC Tag",
      description:
        "If you select NFC Tag as your Sign Up Option, Hold your Pet Tag to the back of your phone until it is recognized by the app and will redirect you to the registration section.",
    },
    {
      step: 2.2,
      title: "Scan QR Code",
      description:
        "If you select NFC Tag as your Sign Up Option, you need to Align the qr code inside the frame until it is recognized by the app and will redirect you to the registration section.",
    },
    {
      step: 3.1,
      title: "Fill Up Owner Details",
      description:
        "You need to fill your details in this section in order to to proceed to in filling up the Pet Details.",
    },
    {
      step: 3.2,
      title: "Fill Up Pet Details",
      description:
        "Enter your pet details in this section and click continue to proceed to filling up your Login Details.",
    },
    {
      step: 3.3,
      title: "Fill Up Login Details",
      description:
        "Enter your login details carefully since it is the one you're going to use in Signing In. Click submit after complete filling up all details ask and wait for the success message to appear.",
    },
    {
      step: 4,
      title: "Sign In",
      description:
        "You need to enter your login details and click sign in to continue.",
    },
    {
      step: 5,
      title: "Enjoy using our app",
      description:
        "After successful login, you will be redirected to main page which is the Pet Section. You can see here the list of pets you have. Enjoy using our app.",
    },
  ];

  // const swiperRef = useRef<Swiper | null>(null);
  const [realIndex, setRealIndex] = useState(0);
  // const slideTo = (index) => swiper.slideTo(index);

  return (
    <section
      id="howitworks"
      ref={ref1}
      className={`transition-opacity ease-in duration-1000 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      }  overflow-hidden pt-5`}
    >
      <div className="">
        <h1 className="font-semibold text-4xl text-center py-10 text-slate-700">
          How Does It Work?
        </h1>
      </div>
      <div className="relative flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 md:flex-row md:text-left">
        <Swiper
          modules={[Pagination, Navigation]}
          onSlideChange={(swiper: any) => setRealIndex(swiper.realIndex)}
          slidesPerView={1}
          centeredSlides={true}
          pagination={{
            el: "#swiperid",
            type: "progressbar",
          }}
          navigation={true}
          loop={true}
          breakpoints={{
            "768": { slidesPerView: 3 },
          }}
        >
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-01.png"
              alt="Step 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-02.png"
              alt="Step 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-03.png"
              alt="Step 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-04.png"
              alt="Step 4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-05.png"
              alt="Step 5"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-06.png"
              alt="Step 6"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-07.png"
              alt="Step 7"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-08.png"
              alt="Step 8"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="block mx-auto"
              src="/assets/howitworks/Step-09.png"
              alt="Step 9"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="flex justify-center items-center py-5">
        <div className="text-center max-w-xl">
          <h1 className="text-2xl font-semibold text-slate-700">
            {" "}
            Step {steps[realIndex].step}. {steps[realIndex].title}
          </h1>
          <p className="text-sm mt-2 text-slate-700">
            {steps[realIndex].description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
