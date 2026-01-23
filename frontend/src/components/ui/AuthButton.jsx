import clsx from 'clsx'
import {CgSmileNone, CgSpinner} from 'react-icons/cg'
import {HiArrowRight} from 'react-icons/hi'

const AuthButton = ({
   isLoading = false,
   text, 
   className
}) => {
  return (
    <button
      disabled={isLoading}
      type={isLoading ? "button" : "submit"}
      className={clsx("w-full py-2 bg-orange-400 text-white rounded outline-none group cursor-pointer disabled:cursor-no-drop disabled:opacity-55 hover:bg-orange-500 flex justify-center items-center font-medium transition-colors"
         , className
      )}
    > 
      <span>{text}</span> {
         isLoading ?
         <CgSpinner className='inline ml-2 animate-spin text-2xl' />
         : <CgSmileNone className='inline ml-2 group-hover:animate-bounce text-2xl'/>
      }
      
    </button>
  )
}

export default AuthButton