import React, { useEffect, useRef, useState } from "react";
import Navbar2 from "../../../../Landing/Header/Views/index2";
import Footer from "../../../../Landing/Footer/Views";
import {
  Accordion,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  CloseButton,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import FAQSComponent from "../../faqs";
import { Controller, SubmitHandler } from "react-hook-form";
import { Inputs, useLogic } from "./logic";
import PaymentDetailsLoadingComponent from "./LoadingComponents/paymentDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";

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
const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const {
    cartInfo,
    locationInfo,
    control,
    handleSubmit,
    register,
    errors,
    isSubmitting,
    trigger,
    reset,
    setValue,
    setError,
    clearErrors,
    formdata,
    setFormData,
    onChangeInput,
    serializeFormData,
    onSubmit,
    loadedSecurePay,
    products,
    isVisibleAlert,
    onCloseAlert,
    onOpenAlert,
    alert,
    closeAlert,
    isOpenModalProcessing,
    onCloseModalProcessing
  } = useLogic();


  return (
    <div className="bg-gray-100">
      <Navbar2 />
      
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <main className="mx-auto sm:px-6 max-w-7xl md:max-w-7xl px-4">
        
          <section id="home" className="overflow-hidden pt-5 min-h-screen">
            
            <div className="animate-fadeIn animation-delay-2 pt-12 sm:pt-16 md:pt-20 md:text-left mb-4">
              {/* <h1 className="text-3xl font-black text-gray-700 mb-12">
              Order a smart Pet NFC/QR-tag: Checkout
            </h1> */}
              {
                isVisibleAlert ?
                <Alert status={alert.type}>
                <AlertIcon />
                <Box  width="100%">
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>
                    {alert.message}
                  </AlertDescription>
                </Box>
                <CloseButton
                    alignSelf='flex-center'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={closeAlert}
                  />
              </Alert>:
              <></>
              }
            </div>

            <div className="flex flex-col md:flex-row gap-2 ">
              {/* Payment Details */}

              <div className="w-full md:w-7/12 bg-white rounded-md shadow-md px-6 py-5 lg:px-12 lg:py-10">
                <h1 className="text-lg sm:text-base md:text-lg lg:text-xl font-bold text-gray-700">
                  Payment Details
                </h1>
                <p className="text-sm text-gray-500">
                  Enter your payment detais below to purchase.
                </p>

                {loadedSecurePay ? <></> : <PaymentDetailsLoadingComponent />}
                <div
                  className={`transition-opacity duration-500 ease-in-out ${
                    loadedSecurePay ? "opacity-100" : "opacity-0 w-0"
                  } `}
                >
                  {/* Email */}
                  <div className="mt-10">
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel
                        fontSize="sm"
                        className="text-gray-700"
                        fontWeight={700}
                        fontFamily='Arial, Helvetica, sans-serif'
                      >
                        Email
                      </FormLabel>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            fontSize="sm"
                            size="md"
                            value={formdata.email || ""}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setError("email", {
                                  type: "manual",
                                  message: "This is a required field.",
                                });
                              } else {
                                clearErrors("email");
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.email && errors.email.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>

                  {/* IFRAME for secure Pay */}
                  <div id="securepay-ui-container" className="mt-4"></div>

                  {/* Billing Address 1 */}
                  <div className="">
                    <FormControl isInvalid={!!errors.billing_address1}>
                      <FormLabel
                        fontSize="sm"
                        className="text-gray-700"
                        fontWeight={700}
                        fontFamily='Arial, Helvetica, sans-serif'
                      >
                        Billing Address{" "}
                      </FormLabel>
                      <Controller
                        name="billing_address1"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            fontSize="sm"
                            size="md"
                            value={formdata.billing_address1 || ""}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setError("billing_address1", {
                                  type: "manual",
                                  message: "This is a required field.",
                                });
                              } else {
                                clearErrors("billing_address1");
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.billing_address1 &&
                          errors.billing_address1.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>

                  {/* Billing Address 2 */}
                  <div className="mt-4">
                    <FormControl isInvalid={!!errors.billing_address2}>
                      {/* <FormLabel fontSize="sm"className="text-gray-700" fontWeight={700}>
                   Postal Code{" "}
                    
                  </FormLabel> */}
                      <Controller
                        name="billing_address2"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            fontSize="sm"
                            size="md"
                            value={formdata.billing_address2 || ""}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setError("billing_address2", {
                                  type: "manual",
                                  message: "This is a required field.",
                                });
                              } else {
                                clearErrors("billing_address2");
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.billing_address2 &&
                          errors.billing_address2.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>

                  {/* Billing Address 2 */}
                  <div className="mt-4 grid grid-cols-12 gap-2">
                    {/* State */}
                    <FormControl
                      isInvalid={!!errors.state}
                      className="col-span-12 lg:col-span-6"
                    >
                      <FormLabel
                        fontSize="sm"
                        className="text-gray-700"
                        fontWeight={700}
                        fontFamily='Arial, Helvetica, sans-serif'
                      >
                        State
                      </FormLabel>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            fontSize="sm"
                            size="md"
                            value={formdata.state || ""}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setError("state", {
                                  type: "manual",
                                  message: "This is a required field.",
                                });
                              } else {
                                clearErrors("state");
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.state && errors.state.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/* Postal Code */}
                    <FormControl
                      isInvalid={!!errors.postal_code}
                      className="col-span-12 lg:col-span-6"
                    >
                      <FormLabel
                        fontSize="sm"
                        className="text-gray-700"
                        fontWeight={700}
                        fontFamily='Arial, Helvetica, sans-serif'
                      >
                        Postal Code
                      </FormLabel>
                      <Controller
                        name="postal_code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            fontSize="sm"
                            size="md"
                            value={formdata.postal_code || ""}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setError("postal_code", {
                                  type: "manual",
                                  message: "This is a required field.",
                                });
                              } else {
                                clearErrors("postal_code");
                              }
                              field.onChange(e);
                              onChangeInput(e);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.postal_code && errors.postal_code.message}
                      </FormErrorMessage>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Order Details and Summary 2 */}
              <div className="w-full md:w-5/12 ">
                <div className="bg-white rounded-md shadow-md px-6 py-5 lg:px-12 lg:py-10">
                  <h1 className="text-lg sm:text-base md:text-lg lg:text-xl font-bold text-gray-700">
                    Your Order
                  </h1>

                  <div className="">
                    {cartInfo.items.map((item, idx) => {
                      return (
                        <section className="" key={`order-summary-item-${idx}`}>
                          <Divider
                            className={`my-5 ${idx > 0 ? "" : "hidden"}`}
                          ></Divider>
                          <div
                            className={`flex flex-row gap-5 items-center ${
                              idx > 0 ? "" : "mt-6"
                            }`}
                          >
                            <div className="">
                              <img
                                className="inline-block h-24 w-24 lg:h-24 lg:w-24 object-cover "
                                src={`${products[idx].imageUrl}`}
                                alt="Product Image"
                              />
                            </div>

                            <div className="flex-1">
                              <h1 className="font-semibold text-gray-700">
                                {item.productName}
                              </h1>
                              <h1 className="text-xs text-gray-700">
                                {products[idx].description}
                              </h1>
                              <h1 className="font-semibold text-xs text-gray-700 mt-2">
                                {item.discount > 0 ? (
                                  <Badge
                                    variant="outline"
                                    fontSize={10}
                                    colorScheme="red"
                                  >
                                    {products[idx].discount.type == "fixed"
                                      ? `$${products[idx].discount.value}`
                                      : `${products[idx].discount.value}%`}{" "}
                                    OFF
                                  </Badge>
                                ) : (
                                  ""
                                )}
                              </h1>
                              <h1 className="font-semibold text-xl mt-2">
                                ${item.price.toFixed(2)}
                              </h1>
                            </div>

                            <div className="">
                              <h1 className="text-xl font-semibold text-gray-700">
                                x {item.quantity}
                              </h1>
                            </div>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-md shadow-md  px-6 py-5 lg:px-12 lg:py-10 mt-2">
                  <h1 className="text-lg sm:text-base md:text-lg lg:text-xl font-bold text-gray-700">
                    Order Summary
                  </h1>

                  <div className="flex flex-col mt-4">
                    <div className="flex justify-between items-center">
                      <h1 className="">Subtotal</h1>
                      <h1 className="">
                        $
                        {cartInfo.items.reduce((total, product) => {
                          return total + (product.price * product.quantity);
                        }, 0).toFixed(2)}
                      </h1>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <h1 className="">Discount</h1>
                      <h1 className="">-$
                        {cartInfo.items.reduce((total, product) => {
                            return total + product.discount;
                          }, 0).toFixed(2)}
                      </h1>
                    </div>
                    <div className="">
                      {
                        cartInfo.addtionalFees.map((item, idx)=>{
                          return (
                            <section key={idx}>
                              <div className="flex justify-between items-center mt-2">
                                <h1 className="">Shipping Fee</h1>
                                <h1 className="">+${item.amount.toFixed(2)}</h1>
                              </div>
                            </section>
                          )
                        })
                      }
                    </div>
                  </div>
                  <Divider my={4}></Divider>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold">Total</h1>
                    <h1 className="text-xl font-semibold">
                      ${cartInfo.grandTotal.toFixed(2)}
                    </h1>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <Button
                      className="col-span-6"
                      variant="outline"
                      colorScheme="gray"
                      color="gray.700"
                      fontSize="sm"
                      _hover={{ bg: "gray.100" }}
                      isDisabled={false}
                      onClick={() => {
                        sessionStorage.removeItem('derivedKey');
                        navigate('/order-petnfc-qr-tag', {replace: true})
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="col-span-6"
                      colorScheme="blue"
                      color="white"
                      fontSize="sm"
                      _hover={{ bg: "blue.600" }}
                      loadingText="Processing Payment..."
                      isLoading={isSubmitting}
                      isDisabled={isSubmitting}
                    >
                      Complete Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </form>

      <Footer />
      <Modal isCentered isOpen={isOpenModalProcessing} onClose={onCloseModalProcessing} closeOnOverlayClick={false}>
        <ModalOverlay
          bg='blackAlpha.100'
          backdropFilter='blur(5px)'
        />
        <ModalContent marginX={2} paddingY={4}>
          <ModalBody>
            <div className="flex items-center justify-center px-10">
              <ReactTyped
                className="font-bold text-gray-700"
                strings={[
                  "Processing payment",
                  "Processing payment.",
                  "Processing payment..",
                  "Processing payment...",
                ]}
                typeSpeed={40}
                loop
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PlaceOrderPage;
