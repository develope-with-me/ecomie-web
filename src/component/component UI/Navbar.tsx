import React, { useState } from 'react'
import iconLang from '../../images/language.png'
import { useTranslation } from "react-i18next";


const Navbar: React.FC = () => {
    const { t, i18n } = useTranslation();
     const changeLanguage = (lang: string) => {
      i18n.changeLanguage(lang);
    };
    const languageNames:{[key: string]: string} ={
        en: 'English',
        fr: 'Français',
    }

    const [langContainer, SetlangContainer] = useState(false);
    
  return (
    <div className='bg-white py-1 flex justify-end shadow-xl'>
        <div className='items-center relative cursor-pointer justify-items-center left-30px]' onClick={()=>SetlangContainer(!langContainer)}>
        <img className='w-[6%]' src={iconLang} alt="" />
    <p className='relative bottom-1 text-sm'>{languageNames[i18n.language]}</p>
        </div>

    <div className=''>
    {langContainer &&(<ul className='bg-white fixed z-10 right-52 top-16 ' onClick={()=>SetlangContainer(false)}>
        <li className='hover:bg-gray-200 px-2 py-1'> <button onClick={() => changeLanguage("en")}>English</button></li>
        <li className='hover:bg-gray-200 px-2 py-1'> <button onClick={() => changeLanguage("fr")}>Français</button></li>
       
     
    </ul>)}
    </div>
      
    </div>
  )
}

export default Navbar
