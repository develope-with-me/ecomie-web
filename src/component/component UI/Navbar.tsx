import React, { useState } from 'react'
import DashboardComponent from '../dashboard/SideBar';

import iconLang from '../../images/language.png'
import { useTranslation } from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';



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

    const [displaySidebar, setDisplaySidebar]= useState(false);
    
  return (
    <div>
    <div className='bg-white py-1 shadow-xl'>

<div className='flex justify-between' onClick={()=>setDisplaySidebar(!displaySidebar)}>
  <div className='md:hidden block'>
<MenuIcon/>
</div>

        <div className='items-center relative cursor-pointer justify-items-center left-30px]' onClick={()=>SetlangContainer(!langContainer)}>
        <img className='w-[6%]' src={iconLang} alt="" />
    <p className='relative bottom-1 text-sm'>{languageNames[i18n.language]}</p>
        </div>
        </div>

    <div className=''>
    {langContainer &&(<ul className='bg-white fixed z-10 right-52 top-16 ' onClick={()=>SetlangContainer(false)}>
        <li className='hover:bg-gray-200 px-2 py-1'> <button onClick={() => changeLanguage("en")}>English</button></li>
        <li className='hover:bg-gray-200 px-2 py-1'> <button onClick={() => changeLanguage("fr")}>Français</button></li>
       
     
    </ul>)}
    </div>
      
    </div>
    {displaySidebar &&(
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 md:hidden">
      <button className=" top-4 right-72 z-50 fixed text-white text-xl" onClick={() => setDisplaySidebar(false)}>
        ✖
      </button>
      <div className='relative bottom-9'>
      <DashboardComponent style=" w-[50%] h-[100vh] py-5 dashboard px-7 md:hidden block" />
      </div>
    </div>
     
    )}
    </div>
  )
}

export default Navbar
