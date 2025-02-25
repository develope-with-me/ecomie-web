import React from 'react'
interface InputProps{
    type:string;
    placeholder:string;
    value: string;
    Inputname: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({type, placeholder, value, onChange, Inputname, name}) => {

  return (
    <div className="flex flex-col gap-1  ">
        <label htmlFor=""> {Inputname}</label>
    <input
    name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-1 border border-gray-400 rounded-lg focus:outline-none "
    />
  </div>
  )
}

export default Input
