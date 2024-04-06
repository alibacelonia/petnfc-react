import {
  AiOutlineGithub,
  AiOutlineTwitter,
  AiOutlineLinkedin,
  AiOutlineYoutube,
  AiOutlineFacebook,
  AiOutlineInstagram,
} from "react-icons/ai";

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Image,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";

const Logo = (props: any) => {
  return (
    <div className=" flex items-center justify-start">
      <Image
        className="hidden sm:block"
        src="/logo/2.png" // Route of the image file
        width={45} // Desired size with correct aspect ratio
        alt="logo"
      />
      <h1 className="text-xl font-bold hidden sm:block text-slate-700">
        PetNFC
      </h1>
    </div>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      rel="noreferrer"
      target="_blank"
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const Footer = () => {
  return (
    // <footer className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-5xl">
    //   <hr className="w-full h-0.5 mx-auto mt-8 bg-neutral-200 border-0"></hr>
    //   <div className="mx-auto  p-4 flex flex-col text-center text-neutral-900 md:flex-row md:justify-between">
    //     <div className="flex flex-row items-center justify-center space-x-1 text-neutral-500 dark:text-neutral-100">
    //       © 2023 PetNFC<a href="/" className="hover:underline"></a>
    //     </div>
    //     <div className="flex flex-row items-center justify-center space-x-2 mb-1">
    //       <a
    //         href="https://www.facebook.com/petnfc.au"
    //         rel="noreferrer"
    //         target="_blank"
    //       >
    //         <AiOutlineFacebook
    //           className="transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
    //           size={30}
    //         />
    //       </a>
    //       <a
    //         href="https://www.instagram.com/petnfc.info/"
    //         rel="noreferrer"
    //         target="_blank"
    //       >
    //         <AiOutlineInstagram
    //           className="transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
    //           size={30}
    //         />
    //       </a>

    //       <a href="https://twitter.com/petnfc" rel="noreferrer" target="_blank">
    //         <AiOutlineTwitter
    //           className="transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
    //           size={30}
    //         />
    //       </a>
    //       <a href="https://youtube.com/petnfc" rel="noreferrer" target="_blank">
    //         <AiOutlineYoutube
    //           className="transition-transform cursor-pointer text-neutral-500 dark:text-neutral-100"
    //           size={30}
    //         />
    //       </a>
    //     </div>
    //   </div>
    // </footer>

    <Box
      mt={10}
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "start", md: "start" }}
        align={{ base: "center", md: "center" }}
      >
        <Logo />
        <Text className="grow text-center">© 2023 PetNFC. All rights reserved</Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton
            label={"Facebook"}
            href={"https://www.facebook.com/petnfc.au"}
          >
            <FaFacebook />
          </SocialButton>
          <SocialButton
            label={"Instagram"}
            href={"https://www.instagram.com/petnfc.info/"}
          >
            <FaInstagram />
          </SocialButton>
          {/* <SocialButton label={'YouTube'} href={'https://youtube.com/petnfc'}>
            <FaYoutube />
          </SocialButton> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
