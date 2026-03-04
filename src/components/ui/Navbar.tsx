import React, {useState} from 'react'
import DashboardComponent from '../dashboard/SideBar';

import ecomieLogo from '../../images/ecomie-logo.png'
import {useTranslation} from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import {useGlobalTranslation} from "../../translate/translation-provider";


const Navbar: React.FC = () => {
    const {t, i18n} = useGlobalTranslation();

    const [displaySidebar, setDisplaySidebar] = useState(false);

    const [language, setLanguage] = useState<string>('en');
    const handleLangChange = (event: any) => {
        const selectedLanguage = event.target.value;
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage)
    }

    return (
        <div className=''>
            <nav className='bg-customBlue text-white shadow-md w-auto '>
                <div className='flex align-items-center justify-between'>
                    <div className='nav-item pl-5'>
                        <a className="flex w-2/12">
                            <div>
                                <img src={ecomieLogo} className="w-full" alt=""/>
                            </div>
                            <i className="flex mt-5 text-sm text-center">ECOMIE</i>
                        </a>
                    </div>

                    <div className="flex justify-between items-center w-1/2">
                        <div><a>
                            {t("home")}</a></div>
                        <div><a>Team</a></div>
                        <div><a>About us</a></div>
                        <div className='w-1/4 text-black bg-customBlue'>
                            <select name="language" className="bg-customBlue text-white border-transparent"
                                    value={language} onChange={handleLangChange}>
                                <option value="en" className="bg-white text-black">{t("english")}</option>
                                <option value="fr" className="bg-white text-black">Français</option>
                            </select>
                        </div>
                    </div>
                </div>

            </nav>

            {displaySidebar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 md:hidden"
                     onClick={() => setDisplaySidebar(!displaySidebar)}>
                    <div className=' bg-customBlue w-[215px]' onClick={(e) => e.stopPropagation()}>
                        <button className=" top-4 relative left-44  text-white text-xl"
                                onClick={() => setDisplaySidebar(false)}>
                            ✖
                        </button>
                        <div className='relative top-0'>
                            <DashboardComponent style="  h-[140vh]  dashboard px-7 md:hidden block"/>
                        </div>
                    </div>
                </div>

            )}
        </div>
    )
}

export default Navbar
