import React, { ChangeEvent, useEffect, useState } from "react";
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
  Card,
  CardBody,
  Heading,
  Stack,
  Image,
  Divider,
  Button,
  ButtonGroup,
  CardFooter,
  Checkbox,
  useNumberInput,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Badge,
} from "@chakra-ui/react";

import { ChevronDownIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import SecurePayComponent from "./securePayComponent";
import FAQSComponent from "./faqs";
import ProductList from "./productList";
import {
  HiChevronDown,
  HiOutlineMinus,
  HiOutlineMinusSmall,
  HiPlus,
} from "react-icons/hi2";
import moment from "moment";
import { useLogic } from "./logic";
import { CartInfoContext } from "../../../flux/store/store";
import { useNavigate } from 'react-router-dom';
import { PageInfoContext } from "../../../flux/navigation/store";
import { changePage } from "../../../flux/navigation/action";
import { encrypt } from "../../../utils";

interface FAQSObject {
  question: string;
  answer: string;
}

const faqs: FAQSObject[] = [
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

const OrderItemPage = () => {
  const navigate = useNavigate();
  const [setAllChecked] = React.useState(false);

  const {pageState, pageDispatch} = React.useContext(PageInfoContext)
  const {cartState} = React.useContext(CartInfoContext)

  const {
    fees, 
    products,
    virtualCart, 
    setVirtualCart,
    getDiscountValue,
    checkedItems, 
    setCheckedItems,
    grandTotal,
    checkIfAnyChecked
  } = useLogic();

  const handleCheckout = () => {
    const state = JSON.stringify(cartState, null, 2);
    const encrypted = encrypt(state);

    if(checkIfAnyChecked(checkedItems)){
      const currentPath = window.location.pathname;
      navigate(`${currentPath}/payment?state=${encrypted}`);
    }
  }

  const handleCheckboxChange = (index: any) => (e: any) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = e.target.checked;
    setCheckedItems(newCheckedItems);
    // Find the corresponding product
    const selectedProduct = products[index];
  };

  const handleQuantityChange = (index: number, product: any) => (value: string) => {
    console.info("previous: ", [...virtualCart])
    const newCart = [...virtualCart];
    newCart[index].quantity = parseInt(value);

    newCart[index].discount = product.discount.type === "fixed" ? getDiscountValue(product) : (parseInt(value) * getDiscountValue(product))
    setVirtualCart(newCart);
  };


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
  };

  useEffect(() => {
  }, [virtualCart]);

  useEffect(() => {
  }, [fees]);


  return (
    <div className="bg-gray-100">
      <Navbar2 />
      <main className="mx-auto sm:px-6 max-w-7xl md:max-w-7xl px-4">
        <section id="home" className="overflow-hidden pt-5 min-h-screen">
          <div className="flex flex-col text-center items-center justify-center animate-fadeIn animation-delay-2 pt-20 sm:pt-32 md:flex-row md:text-left">
            <h1 className="text-3xl font-black text-gray-700 mb-12">
              Order a smart Pet NFC/QR-tag
            </h1>
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:gap-2 ">
            <div className="w-full md:w-7/12 bg-white rounded-md shadow-md px-6 py-10">
              <div className="flex flex-col gap-4 ">
                {products.map((product, index) => {
                  return (
                    <div
                      className="flex gap-5 items-center justify-start "
                      key={index}
                    >
                      <Checkbox
                        size="lg"
                        colorScheme="blue"
                        name="qr"
                        value={product.productId}
                        isChecked={checkedItems[index]}
                        onChange={handleCheckboxChange(index)}
                      ></Checkbox>
                      <img
                        className="inline-block h-20 w-24 lg:h-40 lg:w-56 object-cover "
                        src={`/assets/petqr.png`}
                        alt="Pet Image"
                      />
                      <div className="flex flex-col items-start justify-start gap-1.5">
                        <h1 className="text-gray-700 text-sm md:text-lg font-bold ">
                          {product.productName}
                        </h1>
                        <div className="flex flex-row gap-1 px-1.5 bg-stone-200 rounded-sm items-center justify-between">
                          <p className="text-gray-500 text-xs md:text-base">
                            Variation:{" "}
                          </p>
                          <p className="text-gray-500 text-xs md:text-base">
                            {"White"}
                          </p>
                          <HiChevronDown className="text-gray-500 " />
                        </div>
                        <h1 className="text-sm md:text-base font-semibold text-sky-600 ">
                          {product.currency} {product.price.toFixed(2)}
                        </h1>
                        <InputGroup size="md">
                          <InputLeftElement>
                          <Button
                              bg="blue.500"
                              color="white"
                              fontSize="xs"
                              size="sm"
                              isDisabled={virtualCart[index].quantity <= 1}
                              rounded="none"
                              _hover={{ bg: "blue.600" }}
                              onClick={() => {
                                if (virtualCart[index].quantity > 1){
                                  const newCart = [...virtualCart];
                                  handleQuantityChange(index, product)((newCart[index].quantity - 1).toString())
                                }
                              }}
                            >
                              <HiOutlineMinusSmall />
                            </Button>
                          </InputLeftElement>
                          <Input
                            // {...input}
                            min={1}
                            max={100}
                            type="number"
                            bg="white"
                            htmlSize={8}
                            fontSize="lg"
                            className="text-gray-700"
                            textAlign="center"
                            rounded="none"
                            value={virtualCart[index].quantity}
                            onBlur={(e) => {
                              if (!e.target.value) {
                                console.info("previous: ", [...virtualCart])
                                const newCart = [...virtualCart];
                                newCart[index].quantity = 1;
                                newCart[index].discount = getDiscountValue(product)
                                setVirtualCart(newCart);
                              } else {
                                if (parseFloat(e.target.value) > 100){
                                  console.info("previous: ", [...virtualCart])
                                  const newCart = [...virtualCart];
                                  newCart[index].quantity = 100;
                                  newCart[index].discount = product.discount.type === "fixed" ?  
                                      getDiscountValue(product) : 
                                      (newCart[index].quantity * getDiscountValue(product))
                                  setVirtualCart(newCart);
                                }
                                else if(parseFloat(e.target.value) < 1){
                                  console.info("previous: ", [...virtualCart])
                                  const newCart = [...virtualCart];
                                  newCart[index].quantity = 1;
                                  newCart[index].discount = getDiscountValue(product)
                                  setVirtualCart(newCart);
                                }
                              }
                            }}
                            onChange={(e) => {
                              handleQuantityChange(index, product)(e.target.value);
                            }}
                          />

                          <InputRightElement>
                            <Button
                              bg="blue.500"
                              color="white"
                              fontSize="xs"
                              size="sm"
                              isDisabled={virtualCart[index].quantity >= 100}
                              rounded="none"
                              _hover={{ bg: "blue.600" }}
                              onClick={() => {
                                if (virtualCart[index].quantity < 100){
                                  const newCart = [...virtualCart];
                                  handleQuantityChange(index, product)((newCart[index].quantity + 1).toString())
                                }
                              }}
                            >
                              <HiPlus />
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </div>
                    </div>
                  );
                })}
              </div>


              <Divider className="my-8"></Divider>

              
              
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-gray-700 mb-2">Your Order</h1>
                  {virtualCart.map((item, index) => {
                    return (
                      <section key={index} className={`${checkedItems[index] ? "block" : "hidden"}`}>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row items-center justify-between gap-2" key={index}>
                            <p className="grow  text-gray-700">{isNaN(item.quantity) ? 0 : item.quantity}x {item.productName}</p>
                            <p className="text-gray-700">$ {isNaN(item.quantity) ? 0 : ((item.price * item.quantity)).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                        <div className={`${moment(products[index].discount.expirationDate).diff(moment(), "days") < 0 ? "hidden" : "flex flex-row items-center justify-between gap-2 "}`} key={index}>
                          <p className="grow text-gray-700">Discount <Badge variant='outline' fontSize="10" colorScheme='red'>{products[index].discount.type == "fixed" ? `$${products[index].discount.value}` : `${products[index].discount.value}%`} OFF</Badge></p>
                          <p className="text-red-600">- $ {isNaN(item.quantity) ? 0 : (item.discount).toFixed(2)}</p>
                        </div>
                        </div>
                      </section>
                    )
                  })}
                <div className={`${checkIfAnyChecked(checkedItems) ? "flex flex-col gap-2 mt-3" : "hidden"}`}>
                  {fees.map((item, index) => {
                    return (
                      <div className="flex flex-row items-center justify-between" key={index}>
                        <p>{item.display_name}</p>
                        <p className={`${item.amount <= 0 ? "font-bold" : ""} text-gray-700`}>{ item.amount <= 0  ? "FREE" : `$ ${item.amount.toFixed(2)}` }</p>
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-row items-center justify-between mt-6 mb-6">
                  <h1 className="text-lg font-bold text-gray-700">Total Amount</h1>
                  <p className="text-lg font-bold text-gray-700">$ {grandTotal.toFixed(2)}</p>
                </div>
                <Button
                  bg="blue.500"
                  color="white"
                  fontSize="sm"
                  rounded="sm"
                  _hover={{ bg: "blue.600" }}
                  onClick={() => {
                    handleCheckout();
                  }}>Checkout</Button>
              </div>
            </div>
            <div className="w-full md:w-5/12">
              <Flex>
                <Container>
                  <h1 className="mb-4 font-bold text-gray-700 text-xl">
                    Frequently Ask Questions
                  </h1>
                  <Accordion allowToggle width="100%" maxW="lg" rounded="lg">
                    {faqs.map((faq: FAQSObject, i) => (
                      <FAQSComponent key={i} obj={faq} />
                    ))}
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
