"use client";
import { useState } from "react";
import { Transition } from "@headlessui/react";

import "tailwindcss/tailwind.css";
interface FAQItem {
  question: string;
  answer: string;
}

const FAQItems: Array<FAQItem> = [
  {
    question: "What is a petqr-tag?",
    answer:
      "It's a unique QR code tag that can be attached to your pet's collar or other accessories. The QR code can be scanned by anyone with a smartphone  to retrieve your pet's vital information.",
  },
  {
    question: "What kind of information can be stored on a petqr-tag?",
    answer:
      "You can store your pet's name, your contact information, your pet's medical history, and any other important information that could help someone reunite you with your pet if they are lost.",
  },
  {
    question: "How do I create a petqr-tag?",
    answer:
      "You can order our product online from various vendors. Then You will need to provide your pet's information when you place the order, and the tag will be delivered to your doorstep.",
  },
  {
    question: "How do I attach a petqr-tag to my pet's collar?",
    answer:
      "Most petqr-tags come's with a small metal ring that can be attached to your pet's collar. Simply slide the ring through the tag's hole and attach it to the collar.",
  },
  {
    question: "Is it safe to put personal information on a petqr-tag?",
    answer:
      "Yes, it is safe to put your personal information on a petqr-tag. The information is encrypted and can only be accessed by scanning the QR code. Additionally, the information is only visible to the person who scans the tag, so your personal information remains private.",
  },
  {
    question: "Can I update my pet's information on the petqr-tag?",
    answer:
      "Yes, you can update your pet's information on the petqr-tag by logging into your account on the vendor's website and editing the information.",
  },
  {
    question: "Can anyone scan my pet's petqr-tag?",
    answer:
      "Yes, anyone with a smartphone can scan your pet's petqr-tag. It is recommended to only include the necessary information on the tag to ensure your pet's privacy and safety.",
  },
  {
    question: "What should I do if my petqr-tag is lost or damaged?",
    answer:
      "You can order a replacement petqr-tag online from the same vendor you ordered the original tag from. It is recommended to replace the tag as soon as possible to ensure your pet's safety.",
  },
];

const Accordion = () => {
  const [accordion, setAccordion] = useState(-1);

  function toggleAccordion(idx: number) {
    if (accordion === idx) {
      // If the clicked accordion is already open, close it
      setAccordion(-1);
    } else {
      // Otherwise, open the clicked accordion
      setAccordion(idx);
    }
  }

  return (
    <div className="">
      <div className="accordion__faq">
        {FAQItems.map((item, idx) => (
          <div key={idx} onClick={() => toggleAccordion(idx)}>
            <div className="mt-5 cursor-pointer">
              <div
                className={`flex p-5 justify-between accordion__faq-heading bg-slate-100 ${
                  accordion !== idx
                    ? "rounded-md shadow-md"
                    : "rounded-t-lg shadow "
                }`}
              >
                <h3 className="font-semibold  text-slate-700">
                  {item.question}
                </h3>
                <div className="">
                  {accordion === idx ? (
                    <span className="vertical">-</span>
                  ) : (
                    <span className="vertical">+</span>
                  )}
                </div>
              </div>
            </div>
            <Transition
              show={accordion === idx}
              enter="transition-all duration-200 ease-out"
              enterFrom="h-0 opacity-0"
              enterTo="h-full opacity-100"
              leaveFrom="h-full opacity-100"
              leaveTo="h-0 opacity-0"
            >
              {(ref) => (
                <div
                  ref={ref}
                  className="bg-slate-100 px-5 pb-5 rounded-b-lg shadow-md"
                >
                  <p className=" text-slate-700">{item.answer}</p>
                </div>
              )}
            </Transition>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
