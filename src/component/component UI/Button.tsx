import React from 'react'

interface ButtonProps {
  title: string; // Title of the button
  onClick ?: () => void; // onClick event handler
}
const Button: React.FC<ButtonProps> = ({title, onClick }) => {
  return (
    <div>
   <button className="p-1 px-5 rounded rounded-tl-xl rounded-br-xl edit-button"onClick={onClick} >{title}</button>
   </div>
  )
}

export default Button
