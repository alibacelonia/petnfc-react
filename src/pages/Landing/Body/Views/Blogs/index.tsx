"use client"; // this is a client component
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineThumbUp,
  HiOutlineFire,
  HiOutlineChatAlt,
  HiOutlineShare,
  HiOutlineArrowSmRight,
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

const BlogsSection = () => {
    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

  return (
    <section
      id="blogs"
      ref={ref1}
      className={`transition-opacity ease-in duration-1000 ${
        isVisible1 ? "opacity-100" : "opacity-0"
      } overflow-hidden pt-5 bg-amber-1000`}
    >
      <div className="flex flex-col animate-fadeIn animation-delay-2  md:flex-row md:text-left">
        <div className="w-full sm:w-1/2 sm:pr-10">
          <div className="relative pt-4 mx-auto me-md-0">
            <div className="flex flex-col">
              <div className="flex gap-2 mb-4">
                <div className="shrink-0 bg-slate-100 flex gap-1 py-2 px-4 rounded-full">
                  <HiOutlineFire
                    size={24}
                    className="text-orange-400 "
                  ></HiOutlineFire>
                  <span className="text-orange-400 font-semibold">
                    Latest Blog
                  </span>
                </div>
              </div>
              <h1 className="font-semibold text-2xl sm:text-4xl  leading-normal  text-slate-700">
                The Importance of Pet Identification: Why Every Pet Needs a QR
                Tag
              </h1>
              <div className="flex flex-row mt-4 gap-3">
                <div className="shrink-0 py-1 pr-3 border-r-2 border-slate-300">
                  <h4 className="font-medium text-slate-700 ">
                    12 hours ago
                  </h4>
                </div>
                <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                  <HiOutlineThumbUp
                    size={20}
                    className=" text-slate-700 "
                  ></HiOutlineThumbUp>
                  <span className="text-sm font-medium text-slate-700 ">
                    100
                  </span>
                </div>
                <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                  <HiOutlineChatAlt
                    size={20}
                    className=" text-slate-700 "
                  ></HiOutlineChatAlt>
                  <span className="text-sm font-medium text-slate-700 ">
                    100
                  </span>
                </div>
                <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                  <HiOutlineShare
                    size={20}
                    className=" text-slate-700"
                  ></HiOutlineShare>
                  <span className="text-sm font-medium text-slate-700 ">
                    100
                  </span>
                </div>
              </div>
              <div className="flex mt-10">
                <div className="shrink-0 bg-slate-100 px-4 py-2 rounded-md flex gap-1 items-center hover:bg-slate-200 transition duration-300 ease-in-out">
                  <h1 className="text-sm font-medium text-slate-700">
                    Read Article
                  </h1>
                  <HiOutlineArrowSmRight
                    size={20}
                    className="text-slate-700"
                  ></HiOutlineArrowSmRight>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <h1 className="text-lg font-semibold mt-6 md:mt-6 sm:text-2xl text-center sm:text-left text-slate-700">
            Recent Blogs
          </h1>
          <div className="flex flex-row sm:flex-col flex-wrap gap-2 sm:gap-2 mt-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col items-start bg-slate-100 p-3 rounded-md shadow">
                <h1 className="text-slate-700 font-semibold text-lg">
                  5 Reasons Why Pet QR Tags Are Better Than Microchips
                </h1>
                <div className="flex flex-row mt-4 gap-3">
                  <div className="shrink-0 py-1 pr-3 border-r-2 border-slate-300">
                    <h4 className="text-xs font-medium text-slate-700">
                      1 day ago
                    </h4>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineThumbUp
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineThumbUp>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineChatAlt
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineChatAlt>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineShare
                      size={16}
                      className=" text-slate-700"
                    ></HiOutlineShare>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="shrink-0 bg-slate-100 px-4 py-2 rounded-md flex gap-1 items-center hover:bg-slate-200 transition duration-300 ease-in-out">
                    <h1 className="text-sm font-medium text-slate-700">
                      Read Article
                    </h1>
                    <HiOutlineArrowSmRight
                      size={20}
                      className="text-slate-700"
                    ></HiOutlineArrowSmRight>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start bg-slate-100 p-3 rounded-md shadow">
                <h1 className="text-slate-700 font-semibold text-lg">
                  How to Choose the Right QR Tag for Your Pet
                </h1>
                <div className="flex flex-row mt-4 gap-3">
                  <div className="shrink-0 py-1 pr-3 border-r-2 border-slate-300">
                    <h4 className="text-xs font-medium text-slate-700">
                      3 days ago
                    </h4>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineThumbUp
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineThumbUp>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineChatAlt
                      size={16}
                      className="text-slate-700 "
                    ></HiOutlineChatAlt>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineShare
                      size={16}
                      className="text-slate-700"
                    ></HiOutlineShare>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="shrink-0 bg-slate-100 px-4 py-2 rounded-md flex gap-1 items-center hover:bg-slate-200 transition duration-300 ease-in-out">
                    <h1 className="text-sm font-medium text-slate-700">
                      Read Article
                    </h1>
                    <HiOutlineArrowSmRight
                      size={20}
                      className="text-slate-700"
                    ></HiOutlineArrowSmRight>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col items-start bg-slate-100 p-3 rounded-md shadow">
                <h1 className="text-lg font-semibold text-slate-700">
                  Keeping Your Pet Safe: Tips for Preventing Lost Pets
                </h1>
                <div className="flex flex-row mt-4 gap-3">
                  <div className="shrink-0 py-1 pr-3 border-r-2 border-slate-300">
                    <h4 className="text-xs font-medium text-slate-700">
                      5 days ago
                    </h4>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineThumbUp
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineThumbUp>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineChatAlt
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineChatAlt>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineShare
                      size={16}
                      className=" text-slate-700"
                    ></HiOutlineShare>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="shrink-0 bg-slate-100 px-4 py-2 rounded-md flex gap-1 items-center hover:bg-slate-200 transition duration-300 ease-in-out">
                    <h1 className="text-sm font-medium text-slate-700">
                      Read Article
                    </h1>
                    <HiOutlineArrowSmRight
                      size={20}
                      className="text-slate-700"
                    ></HiOutlineArrowSmRight>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start bg-slate-100 p-3 rounded-md shadow">
                <h1 className="text-slate-700 font-semibold text-lg">
                  Success Stories: How Pet QR Tags Helped Reunite Lost Pets with
                  Their Owners
                </h1>
                <div className="flex flex-row mt-4 gap-3">
                  <div className="shrink-0 py-1 pr-3 border-r-2 border-slate-300">
                    <h4 className="text-xs font-medium text-slate-700">
                      1 week ago
                    </h4>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineThumbUp
                      size={16}
                      className="text-slate-700 "
                    ></HiOutlineThumbUp>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineChatAlt
                      size={16}
                      className=" text-slate-700 "
                    ></HiOutlineChatAlt>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                  <div className="shrink-0 py-1 flex flex-row justify-center items-center ">
                    <HiOutlineShare
                      size={16}
                      className="text-slate-700"
                    ></HiOutlineShare>
                    <span className="text-xs font-medium text-slate-700 ">
                      100
                    </span>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="shrink-0 bg-slate-100 px-4 py-2 rounded-md flex gap-1 items-center hover:bg-slate-200 transition duration-300 ease-in-out">
                    <h1 className="text-sm font-medium text-slate-700">
                      Read Article
                    </h1>
                    <HiOutlineArrowSmRight
                      size={20}
                      className="text-slate-700"
                    ></HiOutlineArrowSmRight>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-4 py-2 rounded-md flex gap-1 justify-center items-center hover:bg-slate-200 grow">
              <h1 className="text-sm font-medium text-slate-700">View More</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
