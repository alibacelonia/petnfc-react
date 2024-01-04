import React from "react";
import Navbar from "../../Landing/Header/Views";
import Footer from "../../Landing/Footer/Views";
import Navbar2 from "../../Landing/Header/Views/index2";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
  useColorModeValue,
  Text,
  Container,
  Box,
} from "@chakra-ui/react";

import { ChevronDownIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";

const AccordionItemBuilder = (obj : any) => {
  return (
    <>
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="start"
                textAlign="start"
                p={4}
                gap={4}
                _hover={{
                }}
              >
                {isExpanded ? (
                  <MinusIcon fontSize="8px" color="blue.500"/>
                ) : (
                  <AddIcon fontSize="8px" color="gray.700"/>
                )}

                <Text fontSize="sm"  className={`${isExpanded ? "font-bold" : ""} text-gray-700`}>{obj?.question}</Text>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize="sm" className=" text-gray-700">
                {obj?.answer}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </>
  );
};

const faqs = [
    {
        "question":"Why should I choose for a Pet QR-tag when my pet has a microchip?",
        "answer":"The traditional microchip ensures that a specialist with the chip number can find out the address at which the animal is registered. Unlike the smart Pet QR-tag, the microchip cannot be read by every finder and the owner must hope that the finder will have the animal collected by a specialist or take the animal to the shelter. This costs the pet owner money and ensures that the animal is away from home for a long time."
    },
    {
        "question":"How do you scan a Pet QR-tag?",
        "answer":"Open the Camera application on your smartphone and point the camera at the QR code, the profile will appear and can be opened. The pet owner will now receive an ALERT with the location (if available). If the smartphone does not support QR codes, it is also possible to copy the web address into the internet browser or look up a QR scanner in the AppStore."
    },
    {
        "question":"What is a cloud profile?",
        "answer":"Pet QR combines a tag for your pet with a personal cloud profile. The cloud profile contains all important information, so that the finder can easily contact you."
    },
    {
        "question":"What is the delivery time of my order at Pet QR?",
        "answer":"International orders ship for free and will be delivered within 3-5 days."
    },
    {
        "question":"What are the dimensions of the Pet QR-tag?",
        "answer":"The medal is very compact: 28mm x 32mm. The epoxy layer ensures that the medal is water-resistant."
    },
    {
        "question":"Why do I have to pay monthly costs?",
        "answer":"Thanks to the Pet QR platform, a user can use the Pet QR-tag to store almost unlimited information and make use of great features such as SMS notifications, shared GPS locations and secure data storage. The (continued) development and implementation of the functions costs money, which is why we also ask users to pay a monthly fee per pet in addition to the € 2.95 purchase. We also reimburse replacement costs with the subscription in case the token is damaged. (Fair use)"
    },
]

const OrderItemPage = () => {
  return (
    <div className="bg-gray-100">
      <Navbar2 />
      <main className="mx-auto sm:px-6 md:max-w-7xl max-w-7xl px-4">
        <section id="home" className="overflow-hidden pt-5">
          <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 pt-20 sm:pt-32 md:flex-row md:text-left">
            <h1 className="text-3xl font-black text-gray-700 mb-12">
              Order a smart Pet NFC/QR-tag
            </h1>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-7 bg-white w-full min-h-screen rounded-md shadow-md p-4">
                <div className=" flex items-center justify-center outline outline-1 outline-offset-2 outline-gray-300">
                    <img src="/assets/petqr.png" className=" h-36 my-10 " alt="" />
                </div>
              <h1>HAHAHA</h1>
            </div>
            <div className="col-span-5 w-full">
              <Flex
              >
                <Container>
                <h1 className="mb-4 font-bold text-gray-700 text-xl">Frequently Ask Questions</h1>
                  <Accordion allowToggle width="100%" maxW="lg" rounded="lg">
                    {faqs.map(faq => AccordionItemBuilder(faq))}
                  </Accordion>
                </Container>
              </Flex>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderItemPage;
