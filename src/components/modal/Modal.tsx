import React from 'react'

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;


}

const Modal: React.FC<ModalProps> = ({onClose, children}) => {
    return (
        <div>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 '>
                <div className='bg-white rounded-lg shadow-md w-11/12 md:w-1/2 lg:w-1/3 p-8 '>


                    <button className='float-right text-black text-2xl  rounded ' onClick={onClose}>
                    ✖
                    </button>

                    <div className='mt-9'>{children}</div>
                </div>
            </div>
        </div>
    )
}

export default Modal
