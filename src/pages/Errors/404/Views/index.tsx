'use client'

import { Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {

    const navigate = useNavigate();
  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
        <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page not found.
      </Text>
      <Text color={'gray.500'} mb={6}>
      The page you&apos;re looking for does not seem to exist.
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