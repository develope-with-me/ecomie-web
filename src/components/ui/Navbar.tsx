import React, {useState} from 'react'
import DashboardComponent from '../dashboard/SideBar';

import ecomieLogo from '../../images/ecomie-logo.png'
import {useTranslation} from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import {useGlobalTranslation} from "../../translate/translation-provider";
import { Globe, ChevronDown } from 'lucide-react';


const Navbar: React.FC = () => {
    const {t, i18n} = useGlobalTranslation();

    const [displaySidebar, setDisplaySidebar] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const [language, setLanguage] = useState<string>('en');
    const handleLangChange = (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        setLangDropdownOpen(false);
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
                        <div className='relative'>
                            <button 
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm uppercase">{language}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {langDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-50">
                                    <button 
                                        onClick={() => handleLangChange('en')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${language === 'en' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                                    >
                                        English
                                    </button>
                                    <button 
                                        onClick={() => handleLangChange('fr')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${language === 'fr' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                                    >
                                        Français
                                    </button>
                                </div>
                            )}
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
