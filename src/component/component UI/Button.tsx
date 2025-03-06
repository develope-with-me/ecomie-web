import React from 'react'

interface ButtonProps {
    title: string; // Title of the button
    onClick?: () => void; // onClick event handler
    icon?: string;
}

const Button: React.FC<ButtonProps> = ({title, onClick, icon}) => {
    return (
        <div>
            <button className="p-1 px-5 rounded rounded-tl-xl rounded-br-xl bg-customBlue text-white"
                    onClick={onClick}>
                <i className={icon}></i>
                {title}
            </button>
        </div>
    )
}

export default Button
