'use client'

import { Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

export default function QRCodeIsAlreadyTaken() {

    const navigate = useNavigate();
  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
        <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text">
        409
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        QR code is already taken.
      </Text>
      <Text color={'gray.500'} mb={6}>
        The provided QR Code has already been taken. Please get a new one.
      </Text>

      <Button
      onClick={()=>{

        navigate('/', { replace: false });
      }}
        colorScheme="blue"
        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
        color="white"
        variant="solid">
        Go to Website
      </Button>
    </div>
  )
}