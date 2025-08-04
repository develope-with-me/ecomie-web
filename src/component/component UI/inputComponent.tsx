import React from "react";
import {FieldValues, UseFormRegister} from "react-hook-form";

interface InputProps {
    name?: any;
    type?: string;
    label?: string;
    register?: UseFormRegister<FieldValues>
    placeholder?: string;
    validation?: {};
    error?: any;
    disableField?: any;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => undefined;
}

const InputComponent: React.FC<InputProps> = ({
                                                  type,
                                                  name,
                                                  label,
                                                  register,
                                                  validation,
                                                  error,
                                                  placeholder,
                                                  disableField,
                                                  value,
                                                  onChange,
                                                  ...props
                                              }) => {
    return (
        <div className="flex flex-col gap-1">
            <label>{label}</label>
            <input
                type={type}
                {...register ? register(name, validation) : ''}
                id={name}
                placeholder={placeholder}
                disabled={disableField}
                value={value}
                onChange={onChange}
                {...props}
                className="w-full px-4 py-1 border border-gray-400 rounded-lg  block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            {error && <span className="text-red-500">{error.message}</span>}
        </div>
    );
}

export default InputComponent;