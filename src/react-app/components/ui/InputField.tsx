import React from 'react'
interface InputFieldProps {
    type: string;
    placeholder: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

const InputField: React.FC<InputFieldProps> = ({type,
    placeholder,
    icon,
    value,
    onChange,}) => {
  return (
    <div className="flex items-center border-b border-gray-300 pb-2">
    <span className="material-icons text-black mr-2">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full outline-none placeholder-black"
    />
  </div>
  )
}

export default InputField
