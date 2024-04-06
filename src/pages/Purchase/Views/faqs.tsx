import React from 'react'
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
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

interface FAQSObject {
    question: string;
    answer: string;
}


const FAQSComponent = ({ obj }: { obj: FAQSObject }) => {
    return (
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
      );
}

export default FAQSComponent
