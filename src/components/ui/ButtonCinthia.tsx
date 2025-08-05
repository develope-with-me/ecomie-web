import React from 'react'

interface ButtonProps {
    title: string; // Title of the button
    onClick?: () => void; // onClick event handler
    icon?: string;
}

const ButtonCinthia: React.FC<ButtonProps> = ({title, onClick, icon}) => {
    return (
        <div>
            <button className="p-1 md:px-5 px-3 rounded rounded-tl-xl md:text-[1rem] text-[0.85rem] rounded-br-xl bg-customBlue text-white"
                    onClick={onClick}>
                <i className={icon}></i>
                {title}
            </button>
        </div>
    )
}

export default ButtonCinthia
