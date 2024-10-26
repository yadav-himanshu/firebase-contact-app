import React from 'react'
import { CircleX } from 'lucide-react';
import { createPortal } from 'react-dom';
const Modal = ({onClose, isOpen, children}) => {
  return createPortal(
    <>{
        isOpen&&(
        <>
            <div className='relative z-50 bg-white w-10/12 mx-auto min-h-fit p-3 flex flex-col rounded-md'>
                <CircleX onClick={onClose} className='ml-auto'/>
                {children}
            </div>
            
            
            <div onClick={onClose} className='absolute backdrop-blur h-screen z-40 top-0 w-screen'/>
        </>)
        
    }</>
  ,document.getElementById("modal-root"))

}

export default Modal