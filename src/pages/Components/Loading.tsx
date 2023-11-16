import {
    FiLoader
} from 'react-icons/fi'

const LoadingComponent = () => {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
        <FiLoader  className='animate-spin text-[32] md:text-[40px] text-gray-700'/>
        <h1 className='text-sm md:text-lg font-bold mt-1 text-gray-700'>Loading</h1>
    </div>
  )
}

export default LoadingComponent
