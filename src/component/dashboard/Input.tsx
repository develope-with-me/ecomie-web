import React from 'react'

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    label: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({type, placeholder, value, onChange, label, name}) => {

    return (
        <div className="flex flex-col gap-1  ">
            <label htmlFor=""> {label}</label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-1 border border-gray-400 rounded-lg  block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
        </div>
    )
}

export default Input
